/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $list = $("#JS_list");
            var $tab = $(".JS_tab");
            var $fCode = $("#JS_fcode");
            var $time = $("#JS_time");
            var $shopName = $("#JS_shop_name");
            var $kind = $("#JS_kind");
            var $numbers = $("#JS_numbers");
            var $totalPrice = $("#JS_total_price");
            var $totalQPrice = $("#JS_total_q_price");
            var $totalHPrice = $("#JS_total_h_price");
            var $fj = $("#JS_fj");
            var fCode = $.getParam('fCode');
            var shopName = $.getParam('shopName', decodeURI(location.href));
            var type=0;
            // 请求获得批销单详情
            $.isLogin();
            getData(0);
            function getData() {
                var dataType = {};
                var $loadingMore = $("#JS_loading_more");
                var $loaded = $(".JS_loaded", $loadingMore);
                var oHtml=' <div class="empty-status text-center line-46 border-bottom padding-bottom-12">\
                                <i class="icon icon-loading"></i>\
                            </div>'
                $list.html(oHtml);
                $loadingMore.hide();
                $loaded.hide().prev().show();
                $(window).unbind('scroll');
                $.getData({
                    type: 'get',
                    url: '/contacts/invoice/' + fCode,
                    success: function (data) {
                        $list.empty();
                        switch (type) {
                            case 0:
                                dataType = data.data.standard;
                                break;
                            case 1:
                                dataType = data.data.non_standard;
                                break;
                            case 2:
                                dataType = data.data.return_diff;
                                break;
                            case 3:
                                dataType = data.data.return_back;
                                break;
                        }
                        callBack(data);
                        $.loadMore(dataType, 'contacts/invoice/' + fCode, callBack, 'click',type);
                    }
                })
            }

            function callBack(data) {
                switch (type) {
                    case 0:
                        dataType = data.data.standard.data;
                        break;
                    case 1:
                        dataType = data.data.non_standard.data;
                        break;
                    case 2:
                        dataType = data.data.return_diff.data;
                        break;
                    case 3:
                        dataType = data.data.return_back.data;
                        break;
                }
                var invoiceData = data.data.invoice;
                var invoiceTime = invoiceData.fDate ? invoiceData.fDate : '';
                var fPrice = parseFloat(invoiceData.fTotalmoney);
                var sPrice = parseFloat(invoiceData.fSub_Totalmoney);
                var totalRealPrice = fPrice.add(sPrice);
                var faPrice = parseFloat(invoiceData.fTotalallmoney);
                var saPrice = parseFloat(invoiceData.fSub_Totalallmoney);
                var totalPrice = faPrice.add(saPrice);
                var html = '';
                if(dataType.length==0){
                    html += ' <div id="" class="empty-status text-center padding-bottom-12 border-bottom">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">您还没有相关单据~</p>\
                              </div>';
                    $list.append(html);
                    return false;
                }
                $.each(dataType, function (index, el) {
                    var fZk=el.fZk?el.fZk:100;
                    var discountClass=el.fZk?'':'no-show';
                    html += '<li class="item padding-12 bg-grayc margin-bottom-12 padding-bottom-8">\
                                <p class="margin-lf-8 black">【' + el.fGoodsbarcode + '】</p>\
                                <p class="black line-22">' + el.fGoodsname + '</p>\
                                <p class="black-4 line-22">¥' + parseFloat(el.fPrice).toFixed(2) + '<span class="gray JS_discount '+discountClass+' font-12">(' + parseInt(fZk) / 10 + '折)</span><span class="f-right font-12">×' + parseInt(parseFloat(el.fQty)) + '</span></p>\
                            </li>'
                })
                $list.append(html);
                $fCode.html(invoiceData.fCode);
                $time.html(invoiceTime.substring(0, 19));
                $shopName.html(shopName);
                $kind.html(data.data.standard.total);
                $numbers.html(parseInt(parseFloat(invoiceData.fTotalqty) + parseFloat(invoiceData.fSub_Totalqty)));
                $totalPrice.html(totalPrice.toFixed(2));
                $totalQPrice.html($.getPrice(totalRealPrice.toFixed(2)).qPrice);
                $totalHPrice.html($.getPrice(totalRealPrice.toFixed(2)).hPrice);
                $fj.html(invoiceData.fSlave);
                $fj.click(function(){ 
                    location.href="/view/file.html?file="+invoiceData.fSlave;
                })
                isDiscount();
            }
            function isDiscount(){
                var $discount=$(".JS_discount");
                var isShowDiscount=$.getKey('bwDiscount');
                if (isShowDiscount == '0') {
                    $discount.addClass('no-show');
                }else if(!isShowDiscount){
                    $.getData({
                        type:'get',
                        url:'/me/discount',
                        success:function(data){
                            if(data.data.is_show_discount==0){
                                $discount.addClass('no-show');
                            }
                        }
                    })
                }
            }
            $.tab({
                el: $tab,
                index: 0,
                funs: [function () {
                    getData(0);
                    type=0;
                    $tab.find('a').eq(0).addClass('active');
                }, function () {
                    getData(1);
                    type=1;
                    $tab.find('a').eq(1).addClass('active');
                }, function () {
                    getData(2);
                    type=2;
                    $tab.find('a').eq(2).addClass('active');
                }, function () {
                    getData(3);
                    type=3;
                    $tab.find('a').eq(3).addClass('active');
                }]
            });
        })
    });
});