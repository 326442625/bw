/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $category = $("#category");
            var $nav = $("#JS_nav");
            var $content = $("#JS_content");
            var $total = $("#JS_total");
            var $sidebar = $("#sidebar");
            var $right = $("#JS_right");
            var listData = [];
            var bwHistoryData = {}; 
            if (history.state && $.getKey('bwCategory')&&location.href.indexOf('backGet')!==-1) {
                bwHistoryData = JSON.parse($.getKey('bwCategory'));
                listData = bwHistoryData.listData;
                sidebarTop = bwHistoryData.sidebarTop || 0;
                rightTop = bwHistoryData.rightTop || 0;
                historyIndex = bwHistoryData.index || 0;
                $category.show();
                callback();
                setTimeout(function () {
                    $(".JS_item").eq(historyIndex).trigger('click');
                    $sidebar.scrollTop(sidebarTop);
                    $right.scrollTop(rightTop);
                }, 0);
                history.replaceState({}, null, '#');
            } else {
                // 请求获得分类信息
                $.isLogin();
                $.getData({
                    type: 'get',
                    url: '/book_class',
                    beforeLoading: {
                        el: $category
                    },
                    success: function (data) {
                        listData = data.data.bw.children;
                        callback();
                        bwHistoryData.listData = listData;
                        $.setKey('bwCategory', JSON.stringify(bwHistoryData));
                    }
                })
            }

            function callback() {
                var html = '';
                $.each(listData, function (index, el) {
                    html += '<li class="JS_item" data-code="' + el.Gtype_Code + '">' + el.Gtype_Name + '</li>'
                });
                $nav.html(html);
                $(".JS_item").eq(0).trigger('click');
            }
            $nav.on('click', '.JS_item', function () {
                var index = $(this).index();
                var Gtype_Code = $(this).data('code');
                var itemData = listData[index].children || [];
                var html = '';
                var sum = 0;
                for (var i = 0; i < itemData.length / 2; i++) {
                    html += '\<li class="clearfix">\
                                <div class="w-col-12">\
                                    <a href="javascript:;" class="JS_link" code="' + itemData[2 * i].Gtype_Code + '">' + itemData[2 * i].Gtype_Name + '</a>\
                                </div>'
                    if ((2 * i + 1) < itemData.length) {
                        html += '<div class="w-col-12">\
                            <a href="javascript:;" class="JS_link" code="' + itemData[2 * i + 1].Gtype_Code + '">' + itemData[2 * i + 1].Gtype_Name + '</a>\
                            </div>\
                        </li>'
                    }
                }
                for (var i = 0; i < itemData.length; i++) {
                    sum += parseInt(itemData[i].sum);
                }
                $content.empty().html(html);
                $total.html('共有' + sum + '本');
                $(this).addClass('active').siblings('li').removeClass('active');
                bwHistoryData.index = index;
                $.setKey('bwCategory', JSON.stringify(bwHistoryData));
            })
            $sidebar.scroll(function () {
                bwHistoryData.sidebarTop = $sidebar.scrollTop();
                $.setKey('bwCategory', JSON.stringify(bwHistoryData));
            })
            $right.scroll(function () {
                bwHistoryData.rightTop = $right.scrollTop();
                $.setKey('bwCategory', JSON.stringify(bwHistoryData));
            })
            $content.on('click', '.JS_link', function () {
                var typeCode = $(this).attr('code');
                var param = {
                    H_type: typeCode
                }
                history.replaceState({}, null, '#backGet');
                location.href = "/view/bookList.html?type=2&searchVal=" + JSON.stringify(param);
            })
        })
    });
});