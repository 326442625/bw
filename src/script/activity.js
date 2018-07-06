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
            var urlId = $.getParam('id');
            var urlType = $.getParam('type');
            // 请求获得活动详情
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/activity/' + urlId,
                beforeLoading: {
                    el: $activity
                },
                success: function (data) {
                    callBackActivity(data.data.activity);
                    if (urlType == 2) {
                        callBackWinner(data.data.winner);
                    }  
                }
            })
            $.getData({
                type: 'get',
                url: '/activity/' + urlId + '/me',
                success: function (data) {
                    if (data.data.bookshop_info) {
                        $check.show();
                        $userName.html(data.data.winner_self.name);
                        $shopName.html(data.data.bookshop_info.Wkers_Name);
                        $shopAmount.html(data.data.winner.red_packet_amount);
                        var html = '';
                        $.each(data.data.winner_detail, function (index, el) {
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
                                        <img src="/images/user.png">\
                                    </div>\
                                    <div class="f-left margin-top-5 margin-left-5">\
                                        <p class="font-16">' + el.user.name + '</p>\
                                        <p class="font-13 black-9">' + el.total + '单；' + el.fTotalallmoney + '码洋</p>\
                                    </div>\
                                    <div class="f-right amount">\
                                        <p class="red"><strong>' + parseFloat(el.red_packet_amount).toFixed(2) + '元</strong></p>\
                                    </div>\
                                </li>'
                        })
                        $redList.html(html);
                    }
                }
            })

            function callBackActivity(data) {
                var iconStatus = urlType == '1' ? 'disn' : '';
                var html = '';
                html += ' <p class="text-center font-20 black">' + data.title + '</p>\
                        <p class="time gray font-11">发布时间：' + data.created_at + '</p>\
                        <div class="detail">\
                            <h2 class="text-center font-17 black-4">活\
                                <i class="icon icon-act-border"></i>\
                                动\
                                <i class="icon icon-act-border"></i>\
                                详\
                                <i class="icon icon-act-border"></i>\
                            情</h2>\
                            <p class="margin-top-25 margin-bottom-10 black-7">活动时间：</p>\
                            <p class="gray black-9">' + $.getTime(data.start_time) + '-' + $.getTime(data.end_time) + '</p>\
                            <p class="margin-top-15 margin-bottom-10 black-7">活动细则：</p>\
                            <div>' + data.detail + '</div>\
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
                    var rankHtml = '<strong class="gray">' + el.ranking + '.</strong>';
                    switch (el.ranking) {
                        case 1:
                            rankHtml = '<i class="icon icon-first"></i>';
                            break;
                        case 2:
                            rankHtml = '<i class="icon icon-second"></i>';
                            break;
                        case 3:
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
                                    <p><strong class="black-4">' + el.santong.Wkers_Name + '</strong></p>\
                                    <p class="font-13 black-9">' + el.total + '单；' + parseFloat(el.fTotalallmoney) + '码洋</p>\
                                </td>\
                                <td>\
                                    <p class="red"><strong>' + parseFloat(el.red_packet_amount).toFixed(2) + '元</strong></p>\
                                </td>\
                            </tr>'
                })
                $list.html(html);
            }

            $check.click(function () {
                $.pop({
                    el: $pop
                });
            })
        })
    });
});