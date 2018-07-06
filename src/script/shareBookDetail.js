/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "swiper"], function ($, Swiper) {
        $(function () {
            var $bookDetail = $("#book-detail");
            var $open = $("#JS_open");
            var $hPrice = $("#JS_h_price");
            var $qPrice = $("#JS_q_price");
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
            var $swiper = $(".swiper-wrapper");
            var $openWarpper = $(".open-warpper");
            var $share = $("#JS_share_book");
            var urlBookId = $.getParam('bookId');
            var mImgUrl = 'https://bwst.weilaba.com.cn/images/bw.jpg';
            var mBookName = '书单详情';
            // 请求获得书本详情
            $.isLogin();
            $.getData({
                type: 'get',
                beforeLoading: {
                    el: $bookDetail
                },
                url: '/book_list_share/item/' + urlBookId,
                success: function (data) {
                    if (!data.data.book_data) {
                        layer.msg(data.msg, {
                            time: 2000
                        }, function () {
                            history.go(-1);
                        })
                    }
                    callBack(data.data);
                }
            })

            function callBack(data) {
                var bookData = data.book_data;
                if (!bookData) {
                    $openWarpper.addClass('disn');
                    return false;
                }
                var swiperHtml = '';
                if (!bookData.H_publish_date) {
                    bookData.H_publish_date = '';
                }
                bookData.gallery.unshift({
                    H_image: bookData.H_images
                });
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
                initSwiper();
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
                mImgUrl = $slide.eq(0).children().attr('src');
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