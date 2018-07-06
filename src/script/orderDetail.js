/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $list = $("#JS_list");
            var $kind = $("#JS_kind");
            var $totalPrice = $("#JS_total_price");
            var $totaNumber = $("#JS_total_number");
            var $qPrice = $("#JS_q_price");
            var $hPrice = $("#JS_h_price");
            var $sn=$("#JS_sn");
            var $per=$("#JS_per");
            var $time=$("#JS_time");
            var urlOrderId = $.getParam('orderId');
            // 请求获得订单详情
            $.isLogin();
            $.getData({
                type: 'get',
                beforeGetLoading:true,
                url: '/me/order/' + urlOrderId,
                success: function (data) {
                    callBack(data, true);
                    $.loadMore(data.data.order_item, '/me/order/' + urlOrderId, callBack, 'click');
                }
            })

            function callBack(data, first) {
                var data = data.data;
                var html = '<div>';
                var typeName = data.order.fHanddown == 0 ? '精品图书' : '普通图书';
                var myDate='';
                if (first) {
                    html += '<div class="bg-white">\
                                  <div class="cart-title">\
                                      <span class="font-15">\
                                          <span class="red">订单:</span>&nbsp;&nbsp;' + typeName + '</span>\
                                  </div>'
                }
                $.each(data.order_item.data, function (index, el) {
                    var fH_zk=el.fH_zk?el.fH_zk:100;
                    var discountClass=el.fH_zk?'':'no-show';
                    var numbers = parseInt(parseFloat(el.fH_qty)) + parseInt(parseFloat(el.fH_zdqty));
                    var mImg=el.book?el.book.H_images:el.fH_id+'.jpg';
                    html += '<div class="cart-inner bg-gray JS_detail" id="' + el.fCode + '">\
                        <div class="info clearfix padding-bottom-12">\
                            <a href="/view/bookDetail.html?bookId='+el.fH_id+'">\
                            <div class="img-warpper f-left text-center">\
                                <img src="'+CONST.BaseBookImg+'/' + mImg + '_180x180" height="100%">\
                            </div>\
                            <div class="right-warpper f-right">\
                                <div class="clearfix">\
                                    <p class="title f-left">' + el.fH_name + '</p>\
                                    <div class="f-right">\
                                        <p class="line-22">¥' + parseFloat(el.fH_price).toFixed(2) + '</p>\
                                        <p class="JS_discount '+discountClass+' gray font-12 text-right">(' + parseInt(el.fH_zk) / 10 + '折)</p>\
                                    </div>\
                                </div>\
                                <div class="f-left margin-top-6 font-12 gray">\
                                    <p>订购：' + parseInt(parseFloat(el.fH_qty)) + '本</p>\
                                    <p>征订：' + parseInt(parseFloat(el.fH_zdqty)) + '本</p>\
                                </div>\
                                <div class="f-right font-12 margin-top-12">×' + numbers + '</div>\
                            </div>\
                            </a>\
                        </div>\
                    </div>'
                })
                $list.append(html);
                $kind.html(parseInt(data.order.fTotaltypes));
                $totaNumber.html(parseInt(data.order.fTotalqty));
                $totalPrice.html(parseFloat(data.order.fTotalallmoney).toFixed(2));
                $qPrice.html($.getPrice(parseFloat(data.order.fTotalmoney).toFixed(2)).qPrice);
                $hPrice.html($.getPrice(parseFloat(data.order.fTotalmoney).toFixed(2)).hPrice);
                $sn.html(data.order.fCode);
                if(data.order.wechat_nickname){
                    data.order.fCreate_writer=data.order.fCreate_writer+'('+data.order.wechat_nickname+')';
                }
                $per.html(data.order.fCreate_writer);
                if (data.order.fChecked == '1') {
                    orderStatus = '配送时间';
                    myDate = data.order.fCheckdate || '无';
                } else if (data.order.fCked == '0') {
                    orderStatus = '订单创建时间';
                    myDate = data.order.fDate || '';
                } else if (data.order.fCked == '1') {
                    orderStatus = '订单提交时间';
                    myDate = data.order.fCkdate || '';
                }
                $time.prev().html(orderStatus);
                $time.html(myDate.substring(0,19));
                isDiscount();
                return true;
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