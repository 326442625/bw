/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "swiper"], function ($, Swiper) {
        $(function () {
            var $bookDetail = $("#book-detail");
            var $linkRecord = $("#JS_record");
            var $open = $("#JS_open");
            var $discount = $(".JS_discount");
            var $add = $("#JS_add");
            var $dec = $("#JS_dec");
            var $inc = $("#JS_inc");
            var $number = $("#JS_number");
            var $attention = $("#JS_attention");
            var $attentionInfo = $("#JS_attention_info");
            var $hPrice = $("#JS_h_price");
            var $qPrice = $("#JS_q_price");
            var $coupon = $("#JS_coupon");
            var $coupon2 = $("#JS_coupon2");
            var $bookName = $("#JS_name");
            var $bookNote = $("#JS_note");
            var $bookNumber = $("#JS_book_number");
            var $bookCode = $("#JS_book_code");
            var $bookTime = $("#JS_book_time");
            var $bookZz = $("#JS_zz");
            var $bookKb = $("#JS_kb");
            var $bookPackage = $("#JS_package");
            var $bookWriter = $("#JS_writer");
            var $bookPublish = $("#JS_publish");
            var $bookStatus = $("#JS_status");
            var $bookType = $("#JS_type");
            var $bookSaleType = $("#JS_sale_type");
            var $bookCname = $("#JS_cname");
            var $bookKc = $("#JS_kc");
            var $cartNum = $("#JS_cart_num");
            var $swiper = $(".swiper-wrapper");
            var $marketing = $("#JS_marketing");
            var $marketingName = $("#JS_marketing_name");
            var $marketingContent = $("#JS_marketing_content");
            var $deliverNum = $("#JS_deliver_num");
            var $orderNum = $("#JS_order_num");
            var $userNum = $("#JS_user_num");
            var $startTime = $("#JS_start_time");
            var $endTime = $("#JS_end_time");
            var $openWarpper = $(".open-warpper");
            var $addBook = $("#JS_add_book");
            var $pop = $("#JS_pop");
            var $popImg = $("#JS_pop").find('img');
            var $shareList = $("#JS_share_list");
            var $share = $("#JS_share_book");
            var urlBookId = $.getParam('bookId');
            var isShowDiscount = $.getKey('bwDiscount');
            var stock = 0;
            var mBookData = {};
            var mImgUrl = 'https://bwst.weilaba.com.cn/images/bw.jpg';
            var mBookName = '书单详情';
            // 分享判断
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/auth/check_santong',
                isShare: true,
                success: function (data) {
                    console.log(data)
                    if (data.code == 200) {
                        // 请求获得书本详情
                        $.getData({
                            type: 'get',
                            beforeLoading: {
                                el: $bookDetail
                            },
                            url: '/book/' + urlBookId,
                            success: function (data) {
                                if (data.data.length == 0) {
                                    layer.msg(data.msg, {
                                        time: 2000
                                    }, function () {
                                        history.go(-1);
                                    })
                                }
                                callBack(data.data);
                            }
                        })
                    }else{
                        location.href="/view/shareBookDetail.html?bookId="+urlBookId;
                    }
                }
            })


            function callBack(data) {
                var bookData = data.book_data;
                if (!bookData) {
                    $openWarpper.addClass('disn');
                    return false;
                }
                var orderLog = data.order_log;
                var swiperHtml = '';
                var deliverNum = 0;
                var numArr = [];
                var startTime = $.timeStamp(new Date(parseInt(new Date().getTime()) - 5184000000)).substring(0, 10).replace(/\//g, '-');
                var endTime = $.timeStamp(new Date()).substring(0, 10).replace(/\//g, '-');
                if (!bookData.H_publish_date) {
                    bookData.H_publish_date = '';
                }
                bookData.gallery.unshift({
                    H_image: bookData.H_images
                });
                if (!bookData.discount_1) {
                    $coupon.addClass('no-show');
                } else {
                    $coupon.html(parseFloat(bookData.discount_1) / 10 + '折');
                }
                if (!bookData.discount_2) {
                    $coupon2.addClass('no-show');
                } else {
                    $coupon2.html(parseFloat(bookData.discount_2) / 10 + '折');
                }
                if (!bookData.discount_1 && !bookData.discount_2) {
                    $discount.addClass('no-show');
                }
                $qPrice.html($.getPrice(bookData.H_price).qPrice);
                $hPrice.html($.getPrice(bookData.H_price).hPrice);
                $bookName.html(bookData.H_name);
                mBookName = bookData.H_name;
                $bookNote.html(bookData.H_notes);
                if (!bookData.H_notes) {
                    $openWarpper.hide();
                } else if (parseFloat($bookNote.height() * 0.017067) <= 1) {
                    $openWarpper.hide();
                } else {
                    $bookNote.css({
                        "max-height": "1.023999rem",
                        "display": "-webkit-box"
                    });
                }
                $bookNumber.html(bookData.H_isbn);
                $bookCode.html(bookData.h_barcode);
                $bookTime.html(bookData.H_publish_date.substring(0, 10));
                $bookKb.html(bookData.H_kbname);
                $bookZz.html(bookData.H_zzname);
                $bookPackage.html(bookData.h_package_ammount);
                if (bookData.H_writer) {
                    $bookWriter.html(bookData.H_writer);
                }
                if (bookData.h_publish) {
                    $bookPublish.html(bookData.h_publish);
                }
                if (bookData.h_type01) {
                    $bookStatus.html(bookData.fine_book_state.fName);
                }
                if (bookData.H_Typename) {
                    $bookType.html(bookData.H_Typename);
                }
                if (bookData.h_type04) {
                    $bookSaleType.html(bookData.sale_type.fName);
                }
                if (bookData.h_type02) {
                    $bookCname.html(bookData.h_type02);
                }
                if (bookData.STOCK) {
                    $bookKc.html(parseInt(bookData.STOCK))
                }
                data.favorite ? $attention.removeClass('no-heart') : $attention.addClass('no-heart');
                data.favorite ? $attentionInfo.html('已关注') : $attentionInfo.html('关注');
                $attention.data('isAtte', data.favorite);
                stock = parseInt(bookData.STOCK);
                if (parseInt(data.cart_num) > 99) {
                    $cartNum.addClass('more').html('99+');
                } else {
                    $cartNum.html(data.cart_num);
                }
                $.each(bookData.gallery, function (index, el) {
                    swiperHtml += '<div class="swiper-slide" >\
                                <img src="' + CONST.BaseBookImg + '/' + el.H_image + '_256x480">\
                            </div>'
                })
                $swiper.html(swiperHtml);
                if (bookData.marketing_policy) {
                    $marketing.show();
                    if ($openWarpper.is(':hidden')) {
                        $marketing.addClass('margin-top-20');
                    }
                    $marketingName.html(bookData.marketing_policy.fName);
                    $marketingContent.html(bookData.marketing_policy.fmem);
                }
                $.each(orderLog, function (index, el) {
                    deliverNum = deliverNum + parseInt(parseFloat(el.fh_qty));
                    numArr.push(el.fUsercode);
                })
                $deliverNum.html(deliverNum);
                $orderNum.html(orderLog.length);
                $userNum.html($.unique(numArr).length);
                mBookData.deliverNum = deliverNum;
                mBookData.orderNum = orderLog.length;
                mBookData.userNum = $.unique(numArr).length;
                mBookData.startTime = startTime;
                mBookData.endTime = endTime;
                mBookData.bookName = bookData.H_name;
                mBookData.publish = bookData.h_publish;
                mBookData.price = bookData.H_price;
                mBookData.barCode = bookData.h_barcode;
                mBookData.stock = bookData.STOCK;
                $startTime.html(startTime);
                $endTime.html(endTime);
                initSwiper();
            }

            // 是否显示折扣
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
            // 轮播
            function initSwiper() {
                var $slide = $(".swiper-slide");
                var photos = [];
                var mySwiper = new Swiper('.swiper-container', {
                    autoplay: true, //可选选项，自动滑动
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'fraction',
                        clickable: true
                    }
                })
                $popImg.attr('src', $slide.eq(0).children().attr("src"));
                mImgUrl = $slide.eq(0).children().attr("src"); 
                $slide.click(function () {
                    var src = $(this).children().attr("src").replace(/256x480/, '550x784');
                    var index = $(this).index();
                    layer.photos({
                        photos: {
                            data: [{
                                src: src
                            }]
                        },
                        anim: 5 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
                    });
                })
            }
            // 展开
            $open.click(function () {
                if (!$(this).data('status')) {
                    $bookNote.css({
                        "max-height": "20rem",
                        "display": "block"
                    });
                    $(this).data('status', true).children('span').html('收缩');
                    $(this).children('i').addClass('icon-top').removeClass('icon-bottom');
                } else {
                    $bookNote.css({
                        "max-height": "1.023999rem",
                        "display": "-webkit-box"
                    });
                    $(this).data('status', false).children('span').html('展开');
                    $(this).children('i').addClass('icon-bottom').removeClass('icon-top');
                }
            })
            // 添加关注/删除关注
            $attention.click(function () {
                var isAttr = $(this).data('isAtte');
                if (isAttr) {
                    $attention.addClass('no-heart');
                    $attentionInfo.html('关注');
                    $.getData({
                        type: 'delete',
                        url: '/favorite/' + urlBookId,
                        success: function (data) {
                            layer.msg(data.msg);
                            $attention.data('isAtte', false);
                        }
                    })
                } else {
                    $attention.removeClass('no-heart');
                    $attentionInfo.html('已关注');
                    $.getData({
                        type: 'post',
                        url: '/favorite',
                        param: {
                            book_id: urlBookId,
                        },
                        success: function (data) {
                            layer.msg(data.msg);
                            $attention.data('isAtte', true);
                        }
                    })
                }
            })
            // 加入购物车
            $add.click(function () {
                var number = parseInt($number.val());
                if (!/^[0-9]*[1-9][0-9]*$/.test($number.val())) {
                    $(this).val(1);
                    layer.msg('订购数量为正整数！');
                    return false;
                }
                $.getData({
                    type: 'put',
                    url: '/cart',
                    param: {
                        book_id: urlBookId,
                        qty: number,
                        qty_sub: 0
                    },
                    success: function (data) {
                        layer.msg('成功加入购物车~');
                        $cartNum.html(parseInt($cartNum.html()) + number);
                    }
                })
            })
            // 输入数量
            $number.change(function () {
                var val = $(this).val();
                if (!/^[0-9]*[1-9][0-9]*$/.test(val)) {
                    $(this).val(1);
                    layer.msg('订购数量为正整数！');
                    return false;
                }
                if (parseInt(val) >= stock) {
                    layer.msg('库存不足~');
                    $(this).val(stock);
                } else {
                    $(this).val(parseInt(val));
                }
            })
            // 减少
            $dec.click(function () {
                var number = $number.val();
                if (number == 1) {
                    layer.msg('书本不能再减少了~');
                    return false;
                }
                $number.val(parseInt(number) - 1);
            })
            // 增加
            $inc.click(function () {
                var number = $number.val();
                if (number >= stock) {
                    layer.msg('书本库存不足~');
                    return false;
                }
                $number.val(parseInt(number) + 1);
            })
            // 跳转到记录页
            $linkRecord.click(function () {
                $.setKey('bwBookData', JSON.stringify(mBookData));
                location.href = "/view/bookRecord.html?bookId=" + urlBookId;
            })
            /******------------书单分享-----------------******/
            $.getData({
                type: 'get',
                url: '/book_list_share?book_id=' + urlBookId,
                success: function (data) {
                    shareBookCallBack(data.data);
                }
            })

            function shareBookCallBack(data) {
                var html = ''
                $.each(data, function (index, el) {
                    html += '<li class="item">\
                            <label class="checkbox margin-right-12">\
                                <input type="checkbox" data-id="' + el.id + '" data-status="' + el.has_book + '">\
                                <i class="icon icon-login-no-checked"></i>\
                                <i class="icon icon-login-checked"></i>\
                            </label>\
                            <span class="font-16 black">' + el.list_name + '</span>\
                            <span class="f-right font-15 black-1 JS_book_num">' + el.book_num + '</span>\
                           </li>'
                })
                $shareList.prepend(html);
                initCheck();
            }
            // 从书单添加删除该本书
            function initCheck() {
                var $checkInput = $pop.find('input[type=checkbox]');
                $checkInput.each(function () {
                    var status = $(this).data('status');
                    $(this).prop('checked', status);
                })
                $checkInput.unbind('change');
                $checkInput.change(function () {
                    var checked = $(this).prop('checked');
                    var list_id = $(this).data('id');
                    var $num = $(this).parents('.item').find('.JS_book_num');
                    if (checked) {
                        $.getData({
                            type: 'post',
                            url: '/book_list_share/item',
                            param: {
                                book_id: urlBookId,
                                list_id: list_id
                            },
                            success: function (data) {
                                if (data.code == 201) {
                                    layer.msg('添加成功');
                                    $num.html(parseInt($num.html()) + 1);
                                }
                            }
                        })
                        return false;
                    }
                    $.getData({
                        type: 'delete',
                        url: '/book_list_share/item',
                        param: {
                            book_id: urlBookId,
                            list_id: list_id
                        },
                        success: function (data) {
                            layer.msg('移除成功');
                            $num.html(parseInt($num.html()) - 1);
                        }
                    })
                })
            }
            // 弹窗
            $addBook.click(function () {
                $.pop({
                    el: $pop,
                    top: '120%',
                    clickMaskClose: true,
                    forbidScroll: true
                });
            })
            // 新建书单
            $pop.on('click', '#JS_new_book', function () {
                var $parent = $(this).parent();
                var $input = $parent.prev().find('input');
                $parent.hide().prev().show();
                $input.val('');
            })
            // 新建书单完成
            $pop.on('click', '#JS_new_submit', function () {
                var $input = $(this).prev();
                var val = $input.val();
                var $parent = $(this).parent();
                if (!$.trim(val)) {
                    layer.msg('请填写书单名~');
                    return false;
                }
                $.getData({
                    type: 'post',
                    url: '/book_list_share',
                    param: {
                        list_name: val
                    },
                    success: function (data) {
                        if (data.code == 201) {
                            var html = '<li class="item">\
                                        <label class="checkbox margin-right-12">\
                                            <input type="checkbox" data-id="' + data.data.id + '">\
                                            <i class="icon icon-login-no-checked"></i>\
                                            <i class="icon icon-login-checked"></i>\
                                        </label>\
                                        <span class="font-16 black">' + val + '</span>\
                                        <span class="f-right font-15 black-1">0</span>\
                                      </li>'
                            $parent.before(html);
                            initCheck();
                            layer.msg('新建成功');
                            $parent.hide().next().show();
                        }
                    }
                })
            })
            // 2. 分享接口
            $.getData({
                type: 'post',
                url: '/auth/wx_config?url=' + encodeURIComponent(location.href),
                success: function (data) {
                    shareCallBack(data.data);
                }
            })
            // 分享
            $share.click(function () {
                $.share();
            })

            function shareCallBack(data) {
                var mLink = location.href + '&share=true';
                var mDesc = '博文书单详情分享';
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareAppMessage({
                        title: mBookName,
                        link: mLink,
                        desc: mDesc,
                        imgUrl: mImgUrl,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareTimeline({
                        title: mBookName,
                        link: mLink,
                        desc: mDesc,
                        imgUrl: mImgUrl,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareQQ({
                        title: mBookName,
                        link: mLink,
                        desc: mDesc,
                        imgUrl: mImgUrl,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareWeibo({
                        title: mBookName,
                        link: mLink,
                        desc: mDesc,
                        imgUrl: mImgUrl,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口 
                    wx.onMenuShareQZone({
                        title: mBookName,
                        link: mLink,
                        desc: mDesc,
                        imgUrl: mImgUrl,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });
                })
            }
        })
    });
});