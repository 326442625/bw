/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "swiper","mescroll"], function ($, Swiper,MeScroll) {
        $(function () {
            var $tab = $(".JS_tab");
            var $list = $("#JS_list");
            var orderStatus = $.getKey('bwOrderStatus') || '0';
            var listData = [];
            var bwHistoryData = {};
            var $mescroll=$("#mescroll");  
            if (history.state && $.getKey('bwOrderList') && history.state.back == 'back') {
                bwHistoryData = JSON.parse($.getKey('bwOrderList'));  
                var current_page = bwHistoryData.current_page || 1;
                var last_page = bwHistoryData.last_page || 1;
                var scrollTop = bwHistoryData.sidebarTop || 0;
                var hListData = bwHistoryData.listData || [];
                var data = {
                    data: {
                        current_page: current_page,
                        data: hListData,
                        last_page: last_page
                    }
                }
                getData(orderStatus, data); 
                history.replaceState({}, null, '');
                setTimeout(function () {
                    $mescroll.scrollTop(scrollTop);
                }, 0);
            } else {
                // 请求获得订单列表
                $.isLogin();
                $.getLoading();
                getData(orderStatus);
            }
            var mescroll = new MeScroll("mescroll", {
                down: {
					callback: function(){
                        getData(orderStatus);
                    },
                    auto:false,
                    scrollbar:true
				}
            })
            function getData(type, hisData) {
                var wUrl = '';
                var $loadingMore = $("#JS_loading_more");
                var $loaded = $(".JS_loaded", $loadingMore);
                switch (type) {
                    case '0':
                        wUrl = '/me/order?order_column=fCreate_date&order_direction=desc';
                        break;
                    case '1':
                        wUrl = '/me/order?f[0][column]=fCked&f[0][operator]=equal_to&f[0][query_1]=0&f[1][column]=fChecked&f[1][operator]=equal_to&f[1][query_1]=0&order_column=fCreate_date&order_direction=desc';
                        break;
                    case '2':
                        wUrl = '/me/order?f[0][column]=fCked&f[0][operator]=equal_to&f[0][query_1]=1&f[1][column]=fChecked&f[1][operator]=equal_to&f[1][query_1]=0&order_column=fCkdate&order_direction=desc';
                        break;
                    case '3':
                        wUrl = '/me/order?f[0][column]=fCked&f[0][operator]=equal_to&f[0][query_1]=1&f[1][column]=fChecked&f[1][operator]=equal_to&f[1][query_1]=1&order_column=fCheckdate&order_direction=desc';
                        break;
                } 
                if (hisData) {
                    $list.empty();
                    $loadingMore.hide();
                    $loaded.hide().prev().show();
                    $mescroll.unbind('scroll');
                    callBack(hisData);
                    $mescroll.scroll(function () {   
                        bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                        $.setKey('bwOrderList', JSON.stringify(bwHistoryData));
                    })
                    $.loadMore(data.data, wUrl.substring(1, wUrl.length), callBack,'mescroll');
                    return false;
                }
                $.getData({
                    type: 'get',
                    url: wUrl, 
                    success: function (data) {
                        var $loading = $("#JS_w_loading");
                        $loading.hide();
                        $list.empty();
                        $loadingMore.hide();
                        $loaded.hide().prev().show();
                        $mescroll.unbind('scroll');
                        var oReturn = callBack(data);
                        if (oReturn) {
                            $mescroll.scroll(function () {    
                                bwHistoryData.sidebarTop = $mescroll.scrollTop();
                                $.setKey('bwOrderList', JSON.stringify(bwHistoryData));
                            })
                            $.loadMore(data.data, wUrl.substring(1, wUrl.length), callBack,'mescroll');
                        }
                        mescroll.endSuccess();
                    },error: function() {
                        var $loading = $("#JS_w_loading");
                        $loading.hide();
                        mescroll.endErr();
                    }
                })
            } 
            function callBack(data) {
                var current_page = data.data.current_page || 1;
                var last_page = data.data.last_page || 1;
                var data = data.data.data;
                var html = '';
                if (data.length == 0) {
                    html += ' <div id="" class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">您还没有相关订单~</p>\
                            </div>';
                    $list.html(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    listData.push(el);
                    bwHistoryData.current_page = current_page;
                    bwHistoryData.last_page = last_page;
                    bwHistoryData.listData = listData;
                    $.setKey('bwOrderList', JSON.stringify(bwHistoryData));
                    var typeName = el.fHanddown == 0 ? '精品图书' : '普通图书';
                    var kind = 0;
                    var totalNumber = 0;
                    var totalPrice = 0;
                    var numbers = 0;
                    var orderStatus = '';
                    var timeStatus = ''
                    var changeStatus = 'disn';
                    var myDate = ''; 
                    var createShow=el.fCreate_writer?'':'disn';
                    if (el.fChecked == '1') {
                        orderStatus = '已配货';
                        timeStatus = '配送时间';
                        myDate = el.fCheckdate || '无';
                    } else if (el.fCked == '0') {
                        orderStatus = '待提交';
                        timeStatus = '创建时间';
                        changeStatus = '';
                        myDate = el.fCreate_date || '无';
                    } else if (el.fCked == '1') {
                        orderStatus = '已提交';
                        timeStatus = '提交时间';
                        myDate = el.fCkdate || '无';
                    }
                    html += '<div class="JS_item">\
                              <div class="margin-top-10 serial-number bg-white border-bottom">\
                                  <span class="black font-16">订单编号：' + el.fCode + '</span>\
                                  <span class="red f-right">' + orderStatus + '</span>\
                              </div>\
                              <div class="bg-white">\
                                  <div class="cart-title">\
                                      <span class="font-15 red">' + typeName + '</span>\
                                      <span class="font-12 gray f-right">' + timeStatus + '：' + myDate.substring(0, 19) + '</span>\
                                  </div>\
                                  <a class="JS_link" href="javascript:;" data-id="' + el.fCode + '">\
                                  <div class="cart-inner swiper-container">\
                                        <div class="info clearfix padding-bottom-12 swiper-wrapper">'
                    $.each(el.item, function (index2, el2) {
                        var fH_zk = el2.fH_zk ? el2.fH_zk : 100;
                        var discountClass = el2.fH_zk ? '' : 'no-show';
                        var discount = parseFloat(fH_zk) / 100;
                        var disPrice = parseFloat(el2.fH_price).mul(discount);
                        var mImg = el2.book ? el2.book.H_images : el2.fH_id + '.jpg';
                        kind++;
                        numbers = parseFloat(el2.fH_qty) + parseFloat(el2.fH_zdqty);
                        totalNumber = totalNumber + numbers;
                        totalPrice = totalPrice.add(disPrice.mul(numbers));
                        html += '<div class="img-warpper swiper-slide text-center margin-right-12">\
                                <img src="' + CONST.BaseBookImg + '/' + mImg + '_180x180" height="100%">\
                            </div>'
                    })
                    html += '</div>\
                            </div>\
                            </a>\
                             </div>\
                              <div class="text-right border-top bg-white font-13 padding-top-10 padding-right-12 '+createShow+'">'+el.fCreate_writer+'</div>\
                              <div class="text-right line-36 bg-white font-13">\
                                  <span class="margin-right-10">共' + kind + '种' + totalNumber + '件商品</span>\
                                  <span>总实洋:</span>\
                                  <span class="red margin-right-12">¥\
                                      <span class="font-18">' + $.getPrice(totalPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(totalPrice.toFixed(2)).hPrice + '</span>\
                              </div>\
                              <div class="text-right line-60 bg-white border-top ' + changeStatus + '">\
                                  <a href="javascript:;" class="w-order-button margin-right-10 JS_del" orderId="' + el.fCode + '">删除订单</a><a href="javascript:;" class="r-order-button margin-right-12 JS_edit" status="' + el.fHanddown + '" orderId="' + el.fCode + '">修改订单</a><a href="javascript:;" class="r-order-button margin-right-12 JS_confirm" status="' + el.fHanddown + '" orderId="' + el.fCode + '">提交订单</a>\
                              </div>\
                              </div>'
                })
                $list.append(html); 
                var mySwiper = new Swiper('.swiper-container', {
                    freeMode: true,
                    slidesPerView: 'auto'
                })
                isDiscount(); 
                return true;
            }

            function isDiscount() {
                var $discount = $(".JS_discount");
                var isShowDiscount = $.getKey('bwDiscount');
                if (isShowDiscount == '0') {
                    $discount.addClass('no-show');
                } else if (!isShowDiscount) {
                    $.getData({
                        type: 'get',
                        url: '/me/discount',
                        success: function (data) {
                            if (data.data.is_show_discount == 0) {
                                $discount.addClass('no-show');
                            }
                        }
                    })
                }
            }
            // 详情
            $list.on('click', '.JS_link', function () {
                var orderId = $(this).data('id');
                history.replaceState({
                    back: 'back'
                }, null, '');
                location.href = '/view/orderDetail.html?orderId=' + orderId;
            })
            $list.on('click', '.JS_edit', function () {
                var status = $(this).attr('status');
                var orderId = $(this).attr('orderId');
                var sn = {};
                if (status == 0) {
                    sn.fine_book_sn = orderId;
                } else {
                    sn.general_book_sn = orderId;
                };
                location.href = '/view/cOrder.html?sn=' + JSON.stringify(sn);
            })
            $list.on('click', '.JS_confirm', function () {
                var orderId = $(this).attr('orderId');
                var $item = $(this).parents('.JS_item');
                var $items = $('.JS_item');
                layer.confirm('确定提交该订单？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.getData({
                        type: 'post',
                        url: '/cart/confirm_order/' + orderId,
                        success: function (data) {
                            layer.msg('提交成功', {
                                time: 2000
                            }, function () {
                                if ($items.length == 1) {
                                    var html = ' <div id="" class="empty-status text-center">\
                                                <img src="/images/empty-order.png">\
                                                <p class="gray">您还没有相关订单~</p>\
                                            </div>';
                                    $list.html(html);
                                }
                                $item.remove();
                            });
                        }
                    })
                })
            })
            $list.on('click', '.JS_del', function () {
                var orderId = $(this).attr('orderId');
                var $item = $(this).parents('.JS_item');
                var $items = $('.JS_item');
                layer.confirm('确定删除该订单？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.getData({
                        type: 'delete',
                        url: '/cart/confirm_order/' + orderId,
                        success: function (data) {
                            layer.msg('删除成功', {
                                time: 2000
                            }, function () {
                                if ($items.length == 1) {
                                    var html = ' <div id="" class="empty-status text-center">\
                                                <img src="/images/empty-order.png">\
                                                <p class="gray">您还没有相关订单~</p>\
                                            </div>';
                                    $list.html(html);
                                }
                                $item.remove();
                            });
                        }
                    })
                })
            })
            $.tab({
                el: $tab,
                index: orderStatus,
                funs: [function () {
                    $.setKey('bwOrderStatus', 0);
                    location.href = "/view/order.html";
                }, function () {
                    $.setKey('bwOrderStatus', 1);
                    location.href = "/view/order.html";
                }, function () {
                    $.setKey('bwOrderStatus', 2);
                    location.href = "/view/order.html";
                }, function () {
                    $.setKey('bwOrderStatus', 3);
                    location.href = "/view/order.html";
                }]
            });
            
        })
    });
});