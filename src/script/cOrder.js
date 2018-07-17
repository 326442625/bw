/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $order = $("#bw-order");
            var $quality = $(".quality");
            var $ordinary = $(".ordinary");
            var sn = JSON.parse($.getParam('sn'));
            var getTimes = 0;
            $.isLogin();
            layer.load();
            if (sn.fine_book_sn && sn.general_book_sn) {
                getData(sn.fine_book_sn, 1, $quality);
                getData(sn.general_book_sn, 2, $ordinary, oFun);
            } else if (sn.fine_book_sn && (!sn.general_book_sn)) {
                getData(sn.fine_book_sn, 1, $quality, oFun);
            } else if ((!sn.fine_book_sn) && sn.general_book_sn) {
                getData(sn.general_book_sn, 1, $ordinary, oFun);
            }

            function getData(sn, type, dom, fun) {
                $.getData({
                    type: 'get',
                    async: false,
                    url: '/cart/confirm_order/' + sn,
                    success: function (data) {
                        if (fun) {
                            fun();
                        }
                        var data = data.data;
                        if(data.length==0){
                            var html = '<div class="empty-status text-center">\
                                            <img src="/images/empty-order.png">\
                                            <p class="gray">已经没有修改的订单~</p>\
                                        </div>';
                            $order.html(html);
                            return false;
                        }
                        getTimes++;
                        callBack(sn, data, type, dom);
                        count();
                        
                    }
                })
            }

            function oFun() {
                layer.closeAll('loading');
                $order.show();
            }

            function callBack(sn, data, type, dom) {
                var html = '';
                var bookType = type == 1 ? '精品图书' : '一般图书';
                var oUrl = location.href;
                html += '<div class="cart-title border-bottom">\
                            <span class="font-15"><span class="red">订单:</span>&nbsp;&nbsp;<span class="black">' + bookType + '</span></span>\
                            <a href="/view/sAdd.html?sn=' + sn + '&url=' + oUrl + '"><i class="icon icon-shou-add f-right margin-top-12"></i></a>\
                        </div>'
                $.each(data[0].item, function (index, el) {
                    var fH_zk = el.fH_zk ? el.fH_zk : 100;
                    var discountClass = el.fH_zk ? '' : 'no-show';
                    var stock = el.fH_kc ? parseInt(parseFloat(el.fH_kc)) : 10000;
                    var stockClass = el.fH_kc ? '' : 'no-show';
                    var numbers = (parseInt(parseFloat(el.fH_qty)) + parseInt(parseFloat(el.fH_zdqty)));
                    var totalPrice = parseFloat(el.fH_price).mul(numbers);
                    var oRealPrice = totalPrice.mul(fH_zk);
                    var mImg=el.book?el.book.H_images:el.fH_id+'.jpg';
                    oRealPrice = oRealPrice / 100;
                    html += '<div class="cart-inner" sn="' + sn + '" id=' + el.id + ' isbn="' + el.fH_isbn + '" data-name="' + el.fH_name + '">\
                                    <div class="padding-bottom-12 border-bottom">\
                                        <div class="info clearfix">\
                                          <a href="/view/bookDetail.html?bookId='+el.fH_id+'">\
                                            <div class="img-warpper f-left text-center">\
                                                <img src="' + CONST.BaseBookImg + '/' + mImg + '_180x180" height="100%">\
                                            </div>\
                                            <div class="f-right">\
                                                <p class="title">' + el.fH_name + '</p>\
                                                <p class="font-12">\
                                                    <span data-price="' + el.fH_price + '" class="JS_price">¥<span class="font-18">' + $.getPrice(parseFloat(el.fH_price).toFixed(2)).qPrice + '</span>' + $.getPrice(parseFloat(el.fH_price).toFixed(2)).hPrice + '/本</span>\
                                                    <span class="gray JS_discount ' + discountClass + '">(<span class="JS_coupon">' + parseInt(fH_zk) / 10 + '</span>折)</span>\
                                                    <span class="f-right margin-top-6">×<span class="JS_o_number">' + numbers + '</span></span>\
                                                </p>\
                                                <p class="margin-top-6 font-12">\
                                                    <span class="gray ' + stockClass + ' margin-top-2">(库存：<span class="JS_stock">' + stock + '</span>本)</span>\
                                                    <span class="f-right real-price JS_o_read_price">¥<span class="font-18">' + $.getPrice(oRealPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(oRealPrice.toFixed(2)).hPrice + '</span>\
                                                </p>\
                                            </div>\
                                          </a>\
                                        </div>\
                                        <div class="clearfix margin-top-12">\
                                            <div class="f-left number-line">\
                                                <div>\
                                                    <label class="f-left margin-right-10 font-12">订购 </label>\
                                                    <div class="number f-left" type="1">\
                                                        <span class="decrease f-left"></span><input class="JS_number f-left" type="tel" value="'+parseInt(parseFloat(el.fH_qty))+'"><span class="increase f-left"></span>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="f-right number-line">\
                                                <div>\
                                                    <label class="f-left margin-right-10 font-12">征订 </label>\
                                                    <div class="number f-left" type="2">\
                                                        <span class="decrease f-left"></span><input class="JS_sub_number f-left" type="tel" value="'+ parseInt(parseFloat(el.fH_zdqty))+'"><span class="increase f-left"></span>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>'
                });
                html += '<div class="footer fixed bottom-0 font-12 clearfix border-top padding-0 bg-white">\
                            <a href="javascript:;" sn="' + sn + '" class="JS_submit font-15 f-right text-center white width-100 bg-red">\
                                确定修改\
                            </a>\
                            <div class="f-right border-left text-right padding-left-10 margin-right-10 margin-top-5">\
                                <p>总码洋:<span class="JS_total_price">0.00</span></p>\
                                <p>总实洋：<span class="JS_real_price red">¥<span class="font-18">0</span>.00</span></p>\
                            </div>\
                            <div class="f-right margin-right-10 margin-top-26">\
                                <p class="count">共<span class="JS_kind">0</span>种<span class="JS_total_number">0</span>本</p>\
                            </div>\
                        </div>'
                dom.append(html);
                isDiscount();
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
            // 计算价格
            function count() {
                // 精品图书
                var $qualityItem = $('.quality').find('.cart-inner');
                var $qualityKind = $('.quality').find('.JS_kind');
                var $qualityNumber = $('.quality').find('.JS_total_number');
                var $qualityTotalPrice = $('.quality').find('.JS_total_price');
                var $qualityRealPrice = $('.quality').find('.JS_real_price');
                var qualityKind = 0;
                var qualityNumber = 0;
                var qualityTotalPrice = 0;
                var qualityRealPrice = 0;
                $qualityItem.each(function () {
                    var price = parseFloat($(this).find('.JS_price').data('price'));
                    var coupon = parseFloat($(this).find('.JS_coupon').html()) / 10;
                    var number = parseFloat($(this).find('.JS_number').val());
                    var sub_number = parseFloat($(this).find('.JS_sub_number').val());
                    var couponPrice = price.mul(coupon);
                    var numbers = number + sub_number;
                    qualityKind++;
                    qualityNumber = qualityNumber + numbers;
                    qualityTotalPrice = qualityTotalPrice + price.mul(numbers);
                    qualityRealPrice = qualityRealPrice + couponPrice.mul(numbers);
                })
                $qualityKind.html(qualityKind);
                $qualityNumber.html(qualityNumber);
                $qualityTotalPrice.html(qualityTotalPrice.toFixed(2));
                $qualityRealPrice.html('¥<span class="font-18">' + $.getPrice(qualityRealPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(qualityRealPrice.toFixed(2)).hPrice + '</span>');
                // 一般图书
                var $ordinaryItem = $('.ordinary').find('.cart-inner');
                var $ordinaryKind = $('.ordinary').find('.JS_kind');
                var $ordinaryNumber = $('.ordinary').find('.JS_total_number');
                var $ordinaryTotalPrice = $('.ordinary').find('.JS_total_price');
                var $ordinaryRealPrice = $('.ordinary').find('.JS_real_price');
                var ordinaryKind = 0;
                var ordinaryNumber = 0;
                var ordinaryTotalPrice = 0;
                var ordinaryRealPrice = 0;
                $ordinaryItem.each(function () {
                    var price = parseFloat($(this).find('.JS_price').data('price'));
                    var coupon = parseFloat($(this).find('.JS_coupon').html()) / 10;
                    var number = parseFloat($(this).find('.JS_number').val());
                    var sub_number = parseFloat($(this).find('.JS_sub_number').val());
                    var couponPrice = price.mul(coupon);
                    var numbers = number + sub_number;
                    ordinaryKind++;
                    ordinaryNumber = ordinaryNumber + numbers;
                    ordinaryTotalPrice = ordinaryTotalPrice + price.mul(numbers);
                    ordinaryRealPrice = ordinaryRealPrice + couponPrice.mul(numbers);
                })
                $ordinaryKind.html(ordinaryKind);
                $ordinaryNumber.html(ordinaryNumber);
                $ordinaryTotalPrice.html(ordinaryTotalPrice.toFixed(2));
                $ordinaryRealPrice.html('¥<span class="font-18">' + $.getPrice(ordinaryRealPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(ordinaryRealPrice.toFixed(2)).hPrice + '</span>');
            }
            // 减少
            $order.on('click', '.decrease', function () {
                var $number = $(this).next();
                var number = $number.val();
                var type = $(this).parent().attr('type');
                if (type == '1' && $number.val() == '0') {
                    layer.msg('订购数量不能再减少了！');
                    return false;
                }
                if (type == '2' && $number.val() == '0') {
                    layer.msg('征订数量不能再减少了！');
                    return false;
                }
                $number.val(parseInt(number) - 1);
                var oNumber = $(this).parents('.cart-inner').find('.JS_o_number');
                var oRealPrice = $(this).parents('.cart-inner').find('.JS_o_read_price');
                var price = parseFloat($(this).parents('.cart-inner').find('.JS_price').data('price'));
                var coupon = parseFloat($(this).parents('.cart-inner').find('.JS_coupon').html()) / 10;
                var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();;
                var sn = $(this).parents('.cart-inner').attr('sn');
                var item_id = $(this).parents('.cart-inner').attr('id');
                var isbn = $(this).parents('.cart-inner').attr('isbn');
                var bookName = $(this).parents('.cart-inner').data('name');
                var couponPrice = price.mul(coupon);
                var oNumbers = parseInt(qty) + parseInt(qty_sub);
                var oAllPrice = couponPrice.mul(oNumbers);
                oNumber.html(oNumbers);
                oRealPrice.html('¥<span class="font-18">' + $.getPrice(oAllPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(oAllPrice.toFixed(2)).hPrice);
                count();
            })
            // 增加
            $order.on('click', '.increase', function () {
                var $number = $(this).prev();
                var number = $number.val();
                var stock = parseInt($(this).parents('.cart-inner').find('.JS_stock').html());
                var type = $(this).parent().attr('type');
                if (type == '1' && parseInt(number) >= stock) {
                    layer.msg('库存不足~');
                    return false;
                }
                $number.val(parseInt(number) + 1);
                var oNumber = $(this).parents('.cart-inner').find('.JS_o_number');
                var oRealPrice = $(this).parents('.cart-inner').find('.JS_o_read_price');
                var price = parseFloat($(this).parents('.cart-inner').find('.JS_price').data('price'));
                var coupon = parseFloat($(this).parents('.cart-inner').find('.JS_coupon').html()) / 10;
                var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();;
                var sn = $(this).parents('.cart-inner').attr('sn');
                var item_id = $(this).parents('.cart-inner').attr('id');
                var isbn = $(this).parents('.cart-inner').attr('isbn');
                var bookName = $(this).parents('.cart-inner').data('name');
                var couponPrice = price.mul(coupon);
                var oNumbers = parseInt(qty) + parseInt(qty_sub);
                var oAllPrice = couponPrice.mul(oNumbers);
                oRealPrice.html('¥<span class="font-18">' + $.getPrice(oAllPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(oAllPrice.toFixed(2)).hPrice);
                oNumber.html(oNumbers);
                count();
            })
            // 输入数量
            $order.on('change', 'input[type=tel]', function () {
                var qtyInp;
                var qtySubInp;
                var type = $(this).parent().attr('type');
                var stock = parseInt($(this).parents('.cart-inner').find('.JS_stock').html());
                if (type == 1) {
                    qtyInp = $(this).val();
                    qtySubInp = $(this).parents('.cart-inner').find('.JS_sub_number').val();
                    if (!/^[0-9]*[0-9][0-9]*$/.test(qtyInp)) {
                        $(this).val(1);
                        layer.msg('订购数量为整数！');
                    } else if (parseInt(qtyInp) >= stock) {
                        layer.msg('库存不足~');
                        $(this).val(stock);
                    } else {
                        $(this).val(parseInt(qtyInp));
                    }
                } else {
                    qtySubInp = $(this).val();
                    qtyInp = $(this).parents('.cart-inner').find('.JS_number').val();
                    if (!/^[0-9]*[0-9][0-9]*$/.test(qtySubInp)) {
                        $(this).val(0);
                        layer.msg('征订数量为整数！');
                        return false;
                    }
                    $(this).val(parseInt(qtySubInp));
                }
                var oNumber = $(this).parents('.cart-inner').find('.JS_o_number');
                var oRealPrice = $(this).parents('.cart-inner').find('.JS_o_read_price');
                var price = parseFloat($(this).parents('.cart-inner').find('.JS_price').data('price'));
                var coupon = parseFloat($(this).parents('.cart-inner').find('.JS_coupon').html()) / 10;
                var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();
                var sn = $(this).parents('.cart-inner').attr('sn');
                var item_id = $(this).parents('.cart-inner').attr('id');
                var isbn = $(this).parents('.cart-inner').attr('isbn');
                var bookName = $(this).parents('.cart-inner').data('name');
                var couponPrice = price.mul(coupon);
                var oNumbers = parseInt(qty) + parseInt(qty_sub);
                var oAllPrice = couponPrice.mul(oNumbers);
                oRealPrice.html('¥<span class="font-18">' + $.getPrice(oAllPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(oAllPrice.toFixed(2)).hPrice);
                oNumber.html(oNumbers);
                count();

            })
            // 提交订单
            $order.on('click', '.JS_submit', function () {
                var sn = $(this).attr('sn');
                var $item = $(this).parents('.JS_cart_item');
                var $row = $item.siblings().find('.cart-inner');
                var $inner = $item.find('.cart-inner');
                var isSubmit = true;
                var paramArr=[];
                var submitParam={};
                $inner.each(function () {
                    var qty = $(this).find('.JS_number').val();
                    var qty_sub = $(this).find('.JS_sub_number').val();
                    var item_id=$(this).attr('id');
                    var isbn=$(this).attr('isbn');
                    var name=$(this).data('name');
                    paramArr.push({
                        qty:qty,
                        qty_sub:qty_sub,
                        item_id:item_id,
                        isbn:isbn,
                        name:name,
                        price:''
                    })
                    if ((parseInt(qty) + parseInt(qty_sub)) == 0) {
                        isSubmit = false;
                        return false;
                    }
                })
                if (!isSubmit) {
                    layer.msg('商品订购和征订总数量不能为0~');
                    return false;
                }
                $.each(paramArr,function(index,el){
                    submitParam['u['+index+'][item_id]']=el.item_id;
                    submitParam['u['+index+'][qty]']=el.qty;
                    submitParam['u['+index+'][qty_sub]']=el.qty_sub;
                    submitParam['u['+index+'][fH_isbn]']=el.isbn;
                    submitParam['u['+index+'][fH_name]']=el.name;
                    submitParam['u['+index+'][fH_price]']='';
                })
                $.getData({
                    type: 'put',
                    url: '/cart/confirm_order/' + sn,
                    param:  submitParam,
                    success: function (data) {
                        layer.closeAll();
                        layer.msg('修改成功', {
                            time: 2000
                        }, function () {
                            if ($row.length == 0) {
                                $.setKey('bwOrderStatus', 1);
                                location.href = "/view/order.html";
                            }
                        });
                        $item.empty();
                        if ($row.length == 0) {
                            var html = '<div class="empty-status text-center">\
                                        <img src="/images/empty-order.png">\
                                        <p class="gray">已经没有修改的订单~</p>\
                                       </div>';
                            $order.html(html);
                        }
                    }
                })
            })
        })
    })

});