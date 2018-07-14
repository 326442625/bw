/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $list = $("#JS_list");
            var $fCode = $("#JS_fcode");
            var $time = $("#JS_time");
            var $shopName = $("#JS_shop_name");
            var $kind = $("#JS_kind");
            var $numbers = $("#JS_numbers");
            var $totalPrice = $("#JS_total_price");
            var $totalQPrice = $("#JS_total_q_price");
            var $totalHPrice = $("#JS_total_h_price");
            var $emptyStatus=$(".empty-status");
            var $fj=$("#JS_fj"); 
            var fCode = $.getParam('fCode');
            var shopName = $.getParam('shopName', decodeURI(location.href));
            // 请求获得批销单详情
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/contacts/invoice/' + fCode,
                success: function (data) {
                    callBack(data);
                    $.loadMore(data.data.standard, '/contacts/invoice/'+fCode, callBack, 'click',0);
                }
            })

            function callBack(data) {
                var standardData = data.data.standard.data;
                var invoiceData = data.data.invoice;
                var invoiceTime = invoiceData.fDate ? invoiceData.fDate : '';
                var fPrice = parseFloat(invoiceData.fTotalmoney);
                var sPrice = parseFloat(invoiceData.fSub_Totalmoney);
                var totalRealPrice = fPrice.add(sPrice);
                var faPrice = parseFloat(invoiceData.fTotalallmoney);
                var saPrice = parseFloat(invoiceData.fSub_Totalallmoney);
                var totalPrice = faPrice.add(saPrice);
                var html = '';
                $.each(standardData, function (index, el) {
                    var fZk=el.fZk?el.fZk:100;
                    var discountClass=el.fZk?'':'no-show';
                    html += '<li class="item padding-12 bg-grayc margin-bottom-12 padding-bottom-8">\
                                <p class="margin-lf-8 black">【' + el.fGoodsbarcode + '】</p>\
                                <p class="black line-22">' + el.fGoodsname + '</p>\
                                <p class="black-4 line-22">¥' + parseFloat(el.fPrice).toFixed(2) + '<span class="JS_discount '+discountClass+' gray font-12">(' + parseInt(fZk) / 10 + '折)</span><span class="f-right font-12">×' + parseInt(parseFloat(el.fQty)) + '</span></p>\
                            </li>'
                })
                $emptyStatus.hide();
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
        })
    });
});