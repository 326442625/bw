/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $tab = $(".JS_tab");
            var $list = $("#JS_list");
            var invoicesStatus = $.getKey('bwInvoiceStatus')||'0';
            // 请求获得单据列表
            $.isLogin();
            getData(invoicesStatus);
            function getData(filter) {
                var $loadingMore = $("#JS_loading_more");
                $list.empty();
                $loadingMore.hide();
                $(window).unbind('scroll');
                $.getData({
                    type: 'get',
                    beforeGetLoading: true,
                    url: '/contacts/invoice?filter=' + filter,
                    success: function (data) {
                        var oReturn = callBack(data);
                        if (oReturn) {
                            $.loadMore(data.data, 'contacts/invoice?filter=' + filter, callBack);
                        }
                    }
                })
            }
            function callBack(data) { 
                var data = data.data.data;
                var html = '';
                if (data.length == 0) {
                    html += ' <div id="" class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">您还没有相关单据~</p>\
                            </div>';
                    $list.append(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    var invoicesType = el.fCodetype == 'XT' ? 'icon-tui' : 'icon-xiao';
                    var urlType=el.fCodetype == 'XT'?'invoicesDetail2':'invoicesDetail';
                    var fDate = el.fDate ? el.fDate : '';
                    var totalNumber=parseInt(parseFloat(el.fTotalqty))+parseInt(parseFloat(el.fSub_Totalqty));
                    var fPrice=parseFloat(el.fTotalmoney);
                    var sPrice=parseFloat(el.fSub_Totalmoney);
                    var totalRealPrice=fPrice.add(sPrice);
                    var faPrice=parseFloat(el.fTotalallmoney);
                    var saPrice=parseFloat(el.fSub_Totalallmoney);
                    var totalPrice=faPrice.add(saPrice);
                    html += '<li class="item margin-top-10">\
                                <div class="line-40 bg-white padding-left-12 border-bottom">\
                                    <i class="icon ' + invoicesType + ' margin-right-5"></i><span class="black-4">博文批销单号：<span>' + el.fCode + '</span>\
                                </div>\
                                <div class="padding-12 border-bottom bg-white">\
                                    <p class="margin-bottom-8">\
                                        <i class="icon icon-user-home margin-right-5 margin-bottom-2"></i><span class="font-16">' + el.bookshop.Wkers_Name + '</span>\
                                    </p>\
                                    <p>\
                                        <span class="black-4">×' + totalNumber + '本</span>\
                                        <span class="f-right black-4">总码洋：¥' + totalPrice.toFixed(2) + '</span>\
                                    </p>\
                                    <p class="clearfix font-15">\
                                        <span class="f-right black">总实洋：¥' + totalRealPrice.toFixed(2) + '</span>\
                                    </p>\
                                </div>\
                                <div class="line-45 bg-white padding-left-12 padding-right-12">\
                                    <span class="gray font-13">单据时间：' + fDate.substring(0, 19).replace(/-/g, '/') + '</span>\
                                    <div class="f-right">\
                                        <a href="/view/'+urlType+'.html?fCode='+el.fCode+'&shopName='+el.bookshop.Wkers_Name+'" class="r-order-button padding-tb-2 width-50 JS_check font-12">查看</a>\
                                    </div>\
                                </div>\
                            </li>'
                })
                $list.append(html);
                return true;
            }
            $.tab({
                el: $tab,
                index: invoicesStatus,
                funs: [function () {
                    $.setKey('bwInvoiceStatus',0);
                    location.href="/view/invoices.html";
                }, function () {
                    $.setKey('bwInvoiceStatus',1);
                    location.href="/view/invoices.html";
                }, function () {
                    $.setKey('bwInvoiceStatus',2);
                    location.href="/view/invoices.html";
                }]
            });
        })
    });
});