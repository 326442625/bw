/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $cart = $("#bw-cart");
            var $submit = $("#JS_submit");
            var $del = $("#JS_del");
            var $quality = $(".quality");
            var $ordinary = $(".ordinary");
            var $qTotal = $("#JS_total_q");
            var $hTotal = $("#JS_total_h");
            var $empty=$("#JS_empty");
            var $have=$("#JS_have");
            var $totalWarpper = $("#JS_total_warpper");
            $.isLogin();
            $.refresh();
            $.getData({
                type: 'get',
                url: '/cart',
                beforeLoading:{
                    el:$cart
                },
                success: function (data) {
                    var data = data.data;
                    if(data.fine_book.length==0&&data.general_book==0){
                        $have.hide();
                        $empty.show();
                        return false;
                    }
                    if (data.fine_book.length>0) {
                        callBack(data.fine_book, $quality, 1);
                    }
                    if (data.general_book.length>0) {
                        callBack(data.general_book, $ordinary, 2);
                    }
                    init();
                    $have.show();
                }
            })

            function callBack(data, dom, type) {
                var html = '';
                var bookType = type == 1 ? '精品图书' : '一般图书';
                var bookIcon = type == 1 ? 'icon-quality' : 'icon-ordinary';
                html += '<div class="cart-title border-bottom JS_shop_select_all">\
                                <label class="checkbox margin-right-8">\
                                    <input type="checkbox">\
                                    <i class="icon icon-no-checked2"></i>\
                                    <i class="icon icon-checked2"></i>\
                                </label>\
                                <i class="icon ' + bookIcon + '"></i>\
                                <span class="font-16 black">' + bookType + '</span>\
                                <a href="javascript:;" class="f-right JS_edit black-4">编辑</a>\
                            </div>'
                $.each(data, function (index, el) {
                    var  discount=el.book.discount_1?el.book.discount_1:100;
                    var  discountClass=el.book.discount_1?'':'no-show';
                    var  stock=el.book.STOCK?parseInt(parseFloat(el.book.STOCK)):10000;
                    var  stockClass=el.book.STOCK?'':'no-show';
                    html += '<div class="cart-inner clearfix" id="' + el.id + '">\
                                   <div class="f-left checkbox-warpper">\
                                       <label class="checkbox margin-right-8">\
                                           <input type="checkbox" data-status="' + el.book_status + '">\
                                           <i class="icon icon-no-checked2"></i>\
                                           <i class="icon icon-checked2"></i>\
                                       </label>\
                                   </div>\
                                   <div class="f-left padding-bottom-12">\
                                       <div class="info clearfix">\
                                           <div class="img-warpper f-left text-center">\
                                               <img class="opacity-0" src="'+CONST.BaseBookImg+'/' + el.book.H_id + '.jpg_180x180" height="100%">\
                                           </div>\
                                           <div class="f-right">\
                                               <p class="title"><a href="/view/bookDetail.html?bookId='+el.book_id+'">' + el.book.H_name + '</a></p>\
                                               <p class="font-12">\
                                                   <span class="gray">定价：</span>\
                                                   <span data-price="' + el.book.H_price + '" class="JS_price">¥<span class="font-18">' + $.getPrice(parseFloat(el.book.H_price).toFixed(2)).qPrice + '</span>' + $.getPrice(parseFloat(el.book.H_price).toFixed(2)).hPrice + '/本</span>\
                                               </p>\
                                               <p class="margin-top-6 font-12">\
                                                   <span class="JS_discount '+discountClass+'"><span class="gray JS_discount">折扣：</span>\
                                                   <a href="javascript:;" class="coupon red font-12"><span class="JS_coupon">' + parseInt(discount) / 10 + '</span>折</a></span>\
                                                   <span class="gray f-right '+stockClass+'">(库存：<span class="JS_stock">' + stock + '</span>本)</span>\
                                               </p>\
                                           </div>\
                                       </div>\
                                       <div class="clearfix margin-top-12">\
                                           <div class="f-left number-line">\
                                               <div>\
                                                   <label class="f-left margin-right-10 font-12">订购 </label>\
                                                   <div class="number f-left"  type="1">\
                                                        <span class="decrease f-left"></span><input class="JS_number f-left" type="tel" value="'+el.qty+'"><span class="increase f-left"></span>\
                                                   </div>\
                                               </div>\
                                           </div>\
                                           <div class="f-right number-line">\
                                               <div>\
                                                   <label class="f-left margin-right-10 font-12">征订 </label>\
                                                   <div class="number f-left" type="2">\
                                                        <span class="decrease f-left"></span><input class="JS_sub_number f-left" type="tel" value="'+el.qty_sub+'"><span class="increase f-left"></span>\
                                                   </div>\
                                               </div>\
                                           </div>\
                                       </div>\
                                   </div>\
                            </div>'
                });
                html += '<div class="cart-count font-12 clearfix border-top">\
                            <div class="f-right border-left text-right padding-left-10">\
                                <p>总码洋:¥<span class="JS_total_price">0.00</span></p>\
                                <p>总实洋：<span class="JS_real_price red">¥<span class="font-18">0</span>.00</span></p>\
                            </div>\
                            <div class="f-right margin-right-10 margin-top-20">\
                                <p class="count">共<span class="JS_kind">0</span>种<span class="JS_total_number">0</span>本</p>\
                            </div>\
                        </div>'
                dom.append(html);
            }
            /******------------分割线-----------------******/
            // 初始化
            function init() {
                var $goodsCheck = $('.cart-inner input[type=checkbox]');
                var $shopsCheck = $(".JS_shop_select_all input[type=checkbox]");
                var $allCheck = $(".JS_select_all input[type=checkbox]");
                var initStart = true;
                // 是否显示折扣
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
                $goodsCheck.change(function () {
                    var goods = $(this).closest(".JS_cart_item").find(".cart-inner input[type=checkbox]"); //获取本店铺的所有商品
                    var goodsC = $(this).closest(".JS_cart_item").find(".cart-inner input[type=checkbox]:checked"); //获取本店铺所有被选中的商品
                    var Shops = $(this).closest(".JS_cart_item").find(".JS_shop_select_all input[type=checkbox]"); //获取本店铺的全选按钮
                    if (goods.length == goodsC.length) { //如果选中的商品等于所有商品
                        Shops.prop('checked', true); //店铺全选按钮被选中
                        if ($('.cart-inner input[type=checkbox]').length == $(".cart-inner input:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
                            $allCheck.prop('checked', true); //全选按钮被选中
                        } else {
                            $allCheck.prop('checked', false); //else全选按钮不被选中 
                        }
                    } else { //如果选中的商品不等于所有商品
                        Shops.prop('checked', false); //店铺全选按钮不被选中
                        $allCheck.prop('checked', false); //全选按钮也不被选中
                    }
                    if (!initStart) {
                        var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                        var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();;
                        var book_id = $(this).parents('.cart-inner').attr('id');
                        var status = $(this).parents('.cart-inner').find("input").prop('checked')?1:0;
                        count();
                        $.getData({
                            type: 'post',
                            url: '/cart',
                            param: {
                                'e[0][item]': book_id,
                                'e[0][qty]': qty,
                                'e[0][qty_sub]': qty_sub,
                                'e[0][book_status]': status
                            },
                            success: function () {}
                        })
                    }
                });
                // 点击店铺按钮
                $shopsCheck.change(function () {
                    if ($(this).prop("checked") == true) { //如果店铺按钮被选中
                        $(this).parents(".JS_cart_item").find(".cart-inner input[type=checkbox]").prop('checked', true); //店铺内的所有商品按钮也被选中
                        if ($('.cart-inner input[type=checkbox]').length == $(".cart-inner input:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
                            $allCheck.prop('checked', true); //全选按钮被选中
                        } else {
                            $allCheck.prop('checked', false); //else全选按钮不被选中
                        }
                    } else { //如果店铺按钮不被选中
                        $(this).parents(".JS_cart_item").find(".cart-inner input[type=checkbox]").prop('checked', false); //店铺内的所有商品也不被全选
                        $allCheck.prop('checked', false); //全选按钮也不被选中
                    }
                    var $row = $(this).parents('.cart-title').siblings('.cart-inner');
                    var param = {};
                    $row.each(function (index, el) {
                        param['e[' + index + '][item]'] = $(this).attr('id');
                        param['e[' + index + '][qty]'] = $(this).find('.JS_number').val();
                        param['e[' + index + '][qty_sub]'] = $(this).find('.JS_sub_number').val();
                        param['e[' + index + '][book_status]'] = $(this).find("input[type=checkbox]").prop('checked')?1:0;
                    })
                    count();
                    $.getData({
                        type: 'post',
                        url: '/cart',
                        param: param,
                        success: function () {}
                    })
                });
                // 点击全选按钮
                $allCheck.change(function () {
                    if ($(this).prop("checked") == true) { //如果全选按钮被选中
                        $('.cart-inner input[type=checkbox]').prop('checked', true); //所有按钮都被选中
                        $(".JS_shop_select_all input[type=checkbox]").prop('checked', true);
                        $allCheck.prop('checked', true);
                    } else {
                        $('.cart-inner input[type=checkbox]').prop('checked', false); //else所有按钮不全选
                        $(".JS_shop_select_all input[type=checkbox]").prop('checked', false);
                        $allCheck.prop('checked', false);
                    }
                    var $row = $('.cart-inner');
                    var param = {};
                    $row.each(function (index, el) {
                        param['e[' + index + '][item]'] = $(this).attr('id');
                        param['e[' + index + '][qty]'] = $(this).find('.JS_number').val();
                        param['e[' + index + '][qty_sub]'] = $(this).find('.JS_sub_number').val();
                        param['e[' + index + '][book_status]'] = $(this).find("input[type=checkbox]").prop('checked')?1:0;
                    })
                    count();
                    $.getData({
                        type: 'post',
                        url: '/cart',
                        param: param,
                        success: function () {}
                    })
                });
                $goodsCheck.each(function () {
                    if ($(this).data('status')=='1') {
                        $(this).trigger('click');
                    }
                })
                
                initStart = false;
                count();
            }
            // 计算价格
            function count() {
                var aTotalPrice = 0;
                // 精品图书
                var $qualityCheck = $('.quality').find('.cart-inner input:checked');
                var $qualityKind = $('.quality').find('.JS_kind');
                var $qualityNumber = $('.quality').find('.JS_total_number');
                var $qualityTotalPrice = $('.quality').find('.JS_total_price');
                var $qualityRealPrice = $('.quality').find('.JS_real_price');
                var qualityKind = 0;
                var qualityNumber = 0;
                var qualityTotalPrice = 0;
                var qualityRealPrice = 0;
                $qualityCheck.each(function () {
                    var price = parseFloat($(this).parents('.cart-inner').find('.JS_price').data('price'));
                    var coupon = parseFloat($(this).parents('.cart-inner').find('.JS_coupon').html()) / 10;
                    var number = parseFloat($(this).parents('.cart-inner').find('.JS_number').val());
                    var sub_number = parseFloat($(this).parents('.cart-inner').find('.JS_sub_number').val());
                    var couponPrice = price.mul(coupon);
                    var numbers = number + sub_number;
                    var prices=price.mul(numbers);
                    var couponPrices=couponPrice.mul(numbers);
                    qualityKind++;
                    qualityNumber = qualityNumber + numbers;
                    qualityTotalPrice = qualityTotalPrice.add(prices);
                    qualityRealPrice = qualityRealPrice.add(couponPrices) ;
                })
                $qualityKind.html(qualityKind);
                $qualityNumber.html(qualityNumber);
                $qualityTotalPrice.html(qualityTotalPrice.toFixed(2));
                $qualityRealPrice.html('¥<span class="font-18">' + $.getPrice(qualityRealPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(qualityRealPrice.toFixed(2)).hPrice + '</span>');
                // 一般图书
                var $ordinaryCheck = $('.ordinary').find('.cart-inner input:checked');
                var $ordinaryKind = $('.ordinary').find('.JS_kind');
                var $ordinaryNumber = $('.ordinary').find('.JS_total_number');
                var $ordinaryTotalPrice = $('.ordinary').find('.JS_total_price');
                var $ordinaryRealPrice = $('.ordinary').find('.JS_real_price');
                var ordinaryKind = 0;
                var ordinaryNumber = 0;
                var ordinaryTotalPrice = 0;
                var ordinaryRealPrice = 0;
                $ordinaryCheck.each(function () {
                    var price = parseFloat($(this).parents('.cart-inner').find('.JS_price').data('price'));
                    var coupon = parseFloat($(this).parents('.cart-inner').find('.JS_coupon').html()) / 10;
                    var number = parseFloat($(this).parents('.cart-inner').find('.JS_number').val());
                    var sub_number = parseFloat($(this).parents('.cart-inner').find('.JS_sub_number').val());
                    var couponPrice = price.mul(coupon);
                    var numbers = number + sub_number;
                    var prices=price.mul(numbers);
                    var couponPrices=couponPrice.mul(numbers);
                    ordinaryKind++;
                    ordinaryNumber = ordinaryNumber + numbers;
                    ordinaryTotalPrice = ordinaryTotalPrice.add(prices);
                    ordinaryRealPrice = ordinaryRealPrice.add(couponPrices);
                })
                $ordinaryKind.html(ordinaryKind);
                $ordinaryNumber.html(ordinaryNumber);
                $ordinaryTotalPrice.html(ordinaryTotalPrice.toFixed(2));
                $ordinaryRealPrice.html('¥<span class="font-18">' + $.getPrice(ordinaryRealPrice.toFixed(2)).qPrice + '</span>' + $.getPrice(ordinaryRealPrice.toFixed(2)).hPrice + '</span>');
                aTotalPrice = qualityRealPrice.add(ordinaryRealPrice);
                $qTotal.html($.getPrice(aTotalPrice.toFixed(2)).qPrice);
                $hTotal.html($.getPrice(aTotalPrice.toFixed(2)).hPrice);
                aTotalPrice !== 0?$submit.removeClass('opacity-6'):$submit.addClass('opacity-6');
            }
            // 减少
            $cart.on('click', '.decrease', function () {
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
                var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();;
                var book_id = $(this).parents('.cart-inner').attr('id');
                var status = $(this).parents('.cart-inner').find("input[type=checkbox]").prop('checked')?1:0;
                if (status) {
                    count();
                }
                $.getData({
                    type: 'post',
                    url: '/cart',
                    param: {
                        'e[0][item]': book_id,
                        'e[0][qty]': qty,
                        'e[0][qty_sub]': qty_sub,
                        'e[0][book_status]': status
                    },
                    success: function () {}
                })
            })
            // 增加
            $cart.on('click', '.increase', function () {
                var $number = $(this).prev();
                var number = $number.val();
                var stock = parseInt($(this).parents('.cart-inner').find('.JS_stock').html());
                var type = $(this).parent().attr('type');
                if (type == '1' && parseInt(number) >= stock) {
                    layer.msg('库存不足~');
                    return false;
                }
                $number.val(parseInt(number) + 1);
                var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();;
                var book_id = $(this).parents('.cart-inner').attr('id');
                var status = $(this).parents('.cart-inner').find("input[type=checkbox]").prop('checked')?1:0;
                if (status) {
                    count();
                }
                $.getData({
                    type: 'post',
                    url: '/cart',
                    param: {
                        'e[0][item]': book_id,
                        'e[0][qty]': qty,
                        'e[0][qty_sub]': qty_sub,
                        'e[0][book_status]': status
                    },
                    success: function () {}
                })
            })
            // 输入数量
            $cart.on('change', 'input[type=tel]', function () {
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
                    }else if (parseInt(qtyInp) >= stock) {
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
                    }else{
                        $(this).val(parseInt(qtySubInp));
                    }   
                }
                var book_id = $(this).parents('.cart-inner').attr('id');
                var status = $(this).parents('.cart-inner').find("input[type=checkbox]").prop('checked')?1:0;
                qtyInp = $(this).val();
                qtySubInp = $(this).parents('.cart-inner').find('.JS_sub_number').val();
                if (status) {
                    count();
                }
                $.getData({
                    type: 'post',
                    url: '/cart',
                    param: {
                        'e[0][item]': book_id,
                        'e[0][qty]': qtyInp,
                        'e[0][qty_sub]': qtySubInp,
                        'e[0][book_status]': status
                    },
                    success: function () {}
                })
            })
            // 编辑图书
            $cart.on('click', '.JS_edit', function () {
                var otherHtml = $(this).parents('.JS_cart_item').siblings('.JS_cart_item').find('.JS_edit').html();
                if ($(this).html() == '编辑') {
                    $(this).html('完成').data('isEdit', true);
                } else {
                    $(this).html('编辑').data('isEdit', false);
                }
                if ($(this).html() == '完成' || otherHtml == '完成') {
                    $submit.hide();
                    $totalWarpper.hide();
                    $del.show();
                } else {
                    $submit.show();
                    $totalWarpper.show();
                    $del.hide();

                }
            })
            // 删除图书
            $del.click(function () {
                var book_ids = [];
                var delParam={};
                $(".JS_edit").each(function () {
                    if ($(this).data('isEdit')) {
                        var $checked = $(this).parents(".JS_cart_item").find(".cart-inner input[type=checkbox]:checked");
                        $checked.each(function () {
                            book_ids.push($(this).parents('.cart-inner').attr('id'));
                        })
                    }
                })
                if (book_ids.length==0) {
                    layer.msg('您没有选择商品~');
                    return false;
                }
                $.each(book_ids,function(index,el){
                    delParam['d_item['+index+']']=el;
                })
                $.getData({
                    type: 'delete',
                    url: '/cart',
                    param: delParam,
                    success: function (data) {
                        layer.msg(data.msg);
                        $(".JS_edit").each(function () {
                            if ($(this).data('isEdit')) {
                                var $checked = $(this).parents(".JS_cart_item").find(".cart-inner input[type=checkbox]:checked");
                                $checked.each(function () {
                                    var items = $(this).parents('.JS_cart_item').find('.cart-inner');
                                    if (items.length == 1) {
                                        $(this).parents('.JS_cart_item').empty();
                                    }
                                    $(this).parents('.cart-inner').remove();
                                })
                            }
                            $(this).html('编辑').data('isEdit', false);
                        })
                        if($(".JS_edit").length==0){
                            $have.hide();
                            $empty.show();
                        }
                        $submit.show();
                        $totalWarpper.show();
                        $del.hide();
                        count();
                    }
                })
            })
            // 生成订单
            $submit.click(function () {
                var book_ids = [];
                var submitParam={};
                var $checked = $(".cart-inner input[type=checkbox]:checked");
                $checked.each(function () {
                    var qty = $(this).parents('.cart-inner').find('.JS_number').val();
                    var qty_sub = $(this).parents('.cart-inner').find('.JS_sub_number').val();
                    if((parseInt(qty)+parseInt(qty_sub))==0){
                        book_ids=false;
                        return false;
                    }
                    book_ids.push($(this).parents('.cart-inner').attr('id'));
                })
                if(!book_ids){
                    layer.msg('商品订购和征订总数量不能为0~');
                    return false;
                }else if(book_ids.length==0) {
                    layer.msg('您没有选择商品~');
                    return false;
                }
                $.each(book_ids,function(index,el){
                    submitParam['g_item['+index+']']=el;
                })
                $.getData({
                    type: 'post',
                    url: '/cart/generate_order',
                    param:submitParam,
                    success: function (data) {
                        $.setKey('bwOrderStatus',1);
                        location.href="/view/order.html"; 
                    }
                })
            })
            
          
        })
    });
});