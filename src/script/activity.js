/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $activity = $("#activity");
            var $detail = $("#JS_detail");
            var $list = $("#list");
            var $redList = $("#JS_red_list");
            var $check = $("#JS_check");
            var $prize = $("#prize");
            var $shopName = $("#JS_shop_name");
            var $userName = $("#JS_user_name");
            var $shopAmount = $("#JS_shop_amount");
            var $pop = $("#JS_pop");
            var $userImg=$("#JS_user_img")
            var urlId = $.getParam('id');
            var urlType = $.getParam('type');
            $.isLogin();
            $.getData({ // 请求获得活动详情
                type: 'get',
                url: '/activity_info?id=' + urlId,
                beforeLoading: {
                    el: $activity
                },
                success: function (data) {
                    callBackActivity(data.data);
                }
            })
            if (urlType == 2) { //请求获奖名单
                $.getData({
                    type: 'get',
                    url: '/activity_rank?activity_id=' + urlId,
                    success: function (data) {
                        callBackWinner(data.data);
                    }
                })
            }
            $.getData({
                type: 'get',
                url: '/me',
                async:false,
                success: function (data) { 
                    $userImg.attr('src',data.data.profile.avatar);
                    $userImg.data('id',data.data.user_info.id);
                    $userImg.data('name',data.data.user_info.name); 
                }
            })
            $.getData({ //请求获取我的红包
                type: 'get',
                url: '/activity_user_rank?activity_id=' + urlId,
                success: function (data) {
                    if (data.data.length > 0) {
                        $check.show();
                        $userName.html($userImg.data('name'));
                        $shopName.html(data.data[0].santong_user_title);
                        var html = '';
                        $.each(data.data, function (index, el) {
                            if(el.user_id==0){
                                el.user_title='PC下单';
                                el.user_avatar='/images/icon-tx.png'
                            }else if(el.user_id==parseInt($userImg.data('id'))){
                                $shopAmount.html(el.hb_je);
                            } 
                            var rankHtml = '<span>' + index + '</span>';
                            switch (index) {
                                case 0:
                                    rankHtml = '<i class="icon icon-first2"></i>';
                                    break;
                                case 1:
                                    rankHtml = '<i class="icon icon-second2"></i>';
                                    break;
                                case 2:
                                    rankHtml = '<i class="icon icon-third2"></i>';
                                    break;
                            }
                            html += '<li class="clearfix">\
                                    <div class="f-left ranking">\
                                        ' + rankHtml + '\
                                    </div>\
                                    <div class="f-left">\
                                        <img src="'+el.user_avatar+'">\
                                    </div>\
                                    <div class="f-left margin-top-5 margin-left-5">\
                                        <p class="font-16">' + el.user_title + '</p>\
                                        <p class="font-13 black-9">' + el.order_num + '单；' + el.my_je + '码洋</p>\
                                    </div>\
                                    <div class="f-right amount">\
                                        <p class="red"><strong>' + el.hb_je + '元</strong></p>\
                                    </div>\
                                </li>'
                        })
                        $redList.append(html);
                    }
                }
            })

            function callBackActivity(data) {
                var iconStatus = urlType == '2' ? '' : 'disn';
                var html = '';
                html += ' <p class="text-center font-20 black">' + data.title + '</p>\
                        <p class="time gray font-11">发布时间：' + $.timeStamp(data.add_time * 1000) + '</p>\
                        <div class="detail">\
                            <h2 class="text-center font-17 black-4">活\
                                <i class="icon icon-act-border"></i>\
                                动\
                                <i class="icon icon-act-border"></i>\
                                详\
                                <i class="icon icon-act-border"></i>\
                            情</h2>\
                            <p class="margin-top-25 margin-bottom-10 black-7">活动时间：</p>\
                            <p class="gray black-9">' + $.timeStamp(data.start_time * 1000) + '-' + $.timeStamp(data.end_time * 1000) + '</p>\
                            <p class="margin-top-15 margin-bottom-10 black-7">活动细则：</p>\
                            <div>' + $.getImg(data.content) + '</div>\
                            <i class="icon icon-act-end ' + iconStatus + '"></i>\
                        </div>'
                $detail.html(html);
            }

            function callBackWinner(data) {
                var html = '';
                $prize.show();
                if (data.length == 0) {
                    html += '<tr><td colspan="3">当前暂无中奖数据</td></tr>';
                    $list.append(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    el.santong == null ? el.santong = {} : '';
                    var rankHtml = '<strong class="gray">' + index + '.</strong>';
                    switch (index) {
                        case 0:
                            rankHtml = '<i class="icon icon-first"></i>';
                            break;
                        case 1:
                            rankHtml = '<i class="icon icon-second"></i>';
                            break;
                        case 2:
                            rankHtml = '<i class="icon icon-third"></i>';
                            break;
                    }
                    html += '<tr>\
                                <td>\
                                    <p class="text-center">\
                                        ' + rankHtml + '\
                                    </p>\
                                </td>\
                                <td>\
                                    <p><strong class="black-4">' + el.santong_user_title + '</strong></p>\
                                    <p class="font-13 black-9">' + el.order_num + '单；' + el.my_je + '码洋</p>\
                                </td>\
                                <td>\
                                    <p class="red"><strong>' + el.hb_je + '元</strong></p>\
                                </td>\
                            </tr>'
                })
                $list.append(html);
            }

            $check.click(function () {
                $.pop({
                    el: $pop
                });
            })
        })
    });
});