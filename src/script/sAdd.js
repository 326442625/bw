/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $bookNum = $("input[name=JS_book_num]");
            var $bookName = $("input[name=JS_book_name]");
            var $bookPrice = $("input[name=JS_book_price]");
            var $subNumber = $("#JS_sub_number");
            var $decrease = $(".decrease");
            var $increase = $(".increase");
            var $totalPrice = $("#JS_total_price");
            var $qPrice = $("#JS_total_q");
            var $hPrice = $("#JS_total_h");
            var $submit = $("#JS_submit");
            var sn = $.getParam('sn');
            var oUrl = $.getParam('url');
            var flag = true;
            $bookPrice.change(function () {
                var val = $(this).val();
                if (!/^[0-9\.]*$/.test(val)) {
                    layer.msg('请输入正确的价格~');
                    $(this).val('');
                } else if (parseFloat(val) < 0.01) {
                    layer.msg('请输入大于0.01的价格~');
                    $(this).val('');
                } else if (!/^[0-9]*[1-9][0-9]*$/.test('' + parseFloat(val).mul(100))) {
                    layer.msg('请输入正确的价格~');
                    $(this).val('');
                }
                count()
            })
            $increase.click(function () {
                var $num = $(this).prev();
                var num = $num.val();
                var type = $(this).parent().attr('type');
                $num.val(parseInt(num) + 1);
                count()
            })
            $decrease.click(function () {
                var $num = $(this).next();
                var num = $num.val();
                var type = $(this).parent().attr('type');
                if (type == '1' && num == '1') {
                    layer.msg('订购数量不能再减少了！');
                    return false;
                }
                if (type == '2' && num == '0') {
                    layer.msg('征订数量不能再减少了！');
                    return false;
                }
                $num.val(parseInt(num) - 1);
                count()
            })
            $subNumber.change(function () {
                var val = $(this).val();
                if (!/^[0-9]*[0-9][0-9]*$/.test(val)) {
                    $(this).val(0);
                    count()
                    layer.msg('征订数量为整数！');
                }
                $(this).val(parseInt(val));
                count()
            })

            function count() {
                var priceVal = $bookPrice.val();
                if (!priceVal) {
                    return false;
                }
                var numbers = parseInt($subNumber.val());
                var price = parseFloat(priceVal);
                var totalPrice = price.mul(numbers);
                $totalPrice.html(totalPrice.toFixed(2));
                $qPrice.html($.getPrice(totalPrice.toFixed(2)).qPrice);
                $hPrice.html($.getPrice(totalPrice.toFixed(2)).hPrice);
            }
            $submit.click(function () {
                if (!flag) {
                    return false;
                }
                flag=false;
                var bookNum = $bookNum.val();
                var bookName = $bookName.val();
                var bookPrice = $bookPrice.val();
                var subNumber = $subNumber.val();
                if (!bookNum) {
                    layer.msg('请输入书号!');
                    return false;
                }
                if (!bookName) {
                    layer.msg('请输入书名!');
                    return false;
                }
                if (!bookPrice) {
                    layer.msg('请输入定价!');
                    return false;
                }
                $.getData({
                    type: 'put',
                    url: '/cart/confirm_order/' + sn,
                    param: {
                        'u[0][qty]': 0,
                        'u[0][qty_sub]': subNumber,
                        'u[0][fH_isbn]': bookNum,
                        'u[0][fH_name]': bookName,
                        'u[0][fH_price]': bookPrice
                    },
                    success: function (data) {
                        layer.msg('添加成功');
                        location.href = oUrl;
                    },
                    error: function () {
                        flag=true;
                    }
                })
            })
        })
    });
});