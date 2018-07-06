/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $nav = $(".JS_nav");
            var $content = $(".JS_content");
            var $contentDec = $(".JS_content_dec");
            var $value = $("#JS_value");
            var $list = $("#JS_record_list");
            var $userImg = $("#JS_user_img");
            var $grade = $("#JS_grade");
            var $gradeName = $("#JS_grade_name");
            var $rule=$("#JS_rule");
            var growthData = $.getKey('bwGrowthData') || '{}';
            growthData = JSON.parse(growthData);
            if (!growthData.userImg) {
                location.href = '/view/user.html';
            }
            $userImg.attr("src", growthData.userImg);
            $value.html('我的成长值：' + growthData.value);
            $grade.html(growthData.rank);
            $gradeName.html('-' + growthData.rankName + '-');
            // 请求获得成长值详情
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/level_log',
                cache: false,
                success: function (data) { 
                    var oReturn = callBack(data);
                    if (oReturn) {
                        $.loadMore(data.data, 'level_log', callBack);
                    }
                }
            })
            $.getData({
                type: 'get',
                url: '/article2/9',
                cache: false,
                success: function (data) { 
                    $rule.html(data.data.title); 
                    $contentDec.html(data.data.content);
                }
            })

            function callBack(data) {
                var data = data.data.data;
                var html = '';
                if (data.length == 0) {
                    html += '<div class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">没有相关记录~</p>\
                            </div>';
                    $list.append(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    var time = String(el.created_at).substring(0, 7);
                    var dataTime = $list.data('time');
                    var type = el.type ? '+' : '-';
                    var html2 = '';
                    if (dataTime !== time) {
                        html2 += '<div class="record-title">\
                                <span class="border margin-right-5"></span>\
                                <span>' + time + '</span>\
                              </div>\
                              <ul class="record-list bg-white" data-time="'+time+'"></ul>'
                        $list.append(html2).data('time', time);
                    }
                    html += '<li class="record-item border-bottom" data-time="' + time + '">\
                                <p>\
                                    <span>' + el.source + '</span>\
                                    <span class="f-right">' + type + el.score + '</span>\
                                </p>\
                                <p class="gray font-12">\
                                    <span>' + el.created_at + '</span>\
                                    <span class="f-right">' + el.score_balance + '</span>\
                                </p>\
                            </li>'
                })
                $(".record-list").append(html);
                $(".record-item").each(function () {
                    var tTime = $(this).data('time'); 
                    var pTime = $(this).parent().data('time');
                    if (tTime !== pTime) {
                        $(this).remove();
                    }
                })
                return true;
            }
            $nav.click(function () {
                var index = $(this).index();
                $(this).addClass('active').siblings().removeClass('active');
                $content.eq(index).fadeIn().siblings('.JS_content').fadeOut();
            })
            
        })
    });
});