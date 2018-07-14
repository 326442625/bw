/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "date"], function ($) {
        $(function () {
            var $list = $("#JS_list");
            var raw_id = $.getParam('id');
            var list_id = '';
            var $title = $("#JS_book_title"); 
            var $share=$("#JS_share");
            var bookName = $.getParam('bookName', decodeURI(location.href));
            var isST=false;
            $title.html(bookName);
            $.isLogin();
            $.getData({
                type: 'get',
                beforeGetLoading: true,
                url: '/book_list_share_info?book_list_share_raw_id=' + raw_id,
                success: function (data) {
                    var oReturn = callBack(data);
                    if (oReturn) {
                        $.loadMore(data.data, 'book_list_share_info?book_list_share_raw_id=' + raw_id, callBack);
                    }
                }
            })
            $.getData({
                type: 'get',
                url: '/book_list_share/info/' + raw_id,
                success: function (data) {
                    $title.html(data.data.list_name);
                    list_id = data.data.id;
                }
            })
            $.getData({
                type: 'get', 
                url: '/auth/check_santong',
                isShare:true,
                success: function (data) {
                    if(data.code==200){
                        isST=true;
                    }
                }
            })
            function callBack(data) {
                var data = data.data.data;
                var html = '';
                if (data.length == 0) {
                    html += '<div class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">没有相关图书~</p>\
                            </div>';
                    $list.html(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    var bookId = el.H_id; 
                    var publishDate = el.H_publish_date ? el.H_publish_date : '';
                    var writer = el.H_writer ? el.H_writer : '--';
                    html += '<div class="book-warpper bg-white">\
                                <a class="JS_link" href="javascript:;" data-id="'+bookId+'">\
                                    <div class="img-warpper text-center">\
                                        <img class="opacity-0" src="' + CONST.BaseBookImg + '/' + el.H_images + '_350x350" height="100%">\
                                    </div>\
                                    <div class="padding-8 padding-top-6 desc">\
                                        <p class="serial_number text-over disn"><strong class="black">【' + el.h_barcode + '】</strong></p>\
                                        <p class="title">' + el.H_name + '</p>\
                                        <p class="margin-top-5 disn">\
                                            <a href="javascript:;" class="grayc msg">' + el.H_Typename + '</a>\
                                        </p>\
                                        <p class="sku grayc font-12">\
                                            <span>定价:<span class="red">￥<strong class="font-14">' + $.getPrice(parseFloat(el.H_price).toFixed(2)).qPrice + '</strong>' + $.getPrice(parseFloat(el.H_price).toFixed(2)).hPrice + '</span></span>\
                                        </p>\
                                        <p class="disn font-12 black-a">' + el.h_publish + '</p>\
                                        <a href="javascript:;" class="red-botton f-right remove-btn JS_remove" data-id="' + el.H_id + '">移出书单</a>\
                                    </div>\
                                        </a>\
                                    </div>\
                                </a>\
                            </div>'
                })
                $list.append(html);
                var $remove=$list.find('.JS_remove');
                $remove.hide();
                if(!$.getParam('share')){
                    $remove.fadeIn();
                }
                return true;
            }
            $list.on('click', '.JS_link', function () {
               var bookId=$(this).data('id');
               if(isST){
                   location.href='/view/bookDetail.html?bookId='+bookId;
                   return false;
               }
               location.href='/view/shareBookDetail.html?bookId='+bookId;
            })
            $list.on('click', '.JS_remove', function () {
                var book_id = $(this).data('id');
                var $item = $(this).parents('.book-warpper');
                var $items=$('.book-warpper');
                layer.confirm('确定移出该图书？', {
                    btn: ['确定', '取消'] //按钮
                }, function () {
                    $.getData({
                        type: 'delete',
                        url: '/book_list_share/item',
                        param: {
                            book_id: book_id,
                            list_id: list_id
                        },
                        success: function (data) {
                            layer.msg('移除成功');
                            if($items.length==1){
                                var html = '<div class="empty-status text-center">\
                                            <img src="/images/empty-order.png">\
                                            <p class="gray">没有相关图书~</p>\
                                        </div>';
                                $list.html(html);
                            }
                            $item.remove();
                             
                        }
                    })
                })
            })
            $share.click(function(){
                $.share({});
            }) 
            // 2. 分享接口
            $.getData({
                type: 'post',
                url: '/auth/wx_config?url=' + encodeURIComponent(location.href),
                success: function (data) {
                    shareCallBack(data.data);
                }
            }) 
            function shareCallBack(data) {
                var mLink=location.href+'&share=true';
                var mDesc='博文书单分享';
                var mImgUrl='https://bwst.weilaba.com.cn/images/bw.jpg'; 
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1
                    jsApiList: ['onMenuShareAppMessage','onMenuShareTimeline','onMenuShareQQ','onMenuShareWeibo','onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    // 2.1 监听“分享给朋友”，按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareAppMessage({
                        title: bookName, 
                        link: mLink ,
                        desc:mDesc,
                        imgUrl:mImgUrl ,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.2 监听“分享到朋友圈”按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareTimeline({
                        title: bookName, 
                        link: mLink ,
                        desc:mDesc,
                        imgUrl:mImgUrl ,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.3 监听“分享到QQ”按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareQQ({
                        title: bookName, 
                        link: mLink ,
                        desc:mDesc,
                        imgUrl:mImgUrl ,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.4 监听“分享到微博”按钮点击、自定义分享内容及分享结果接口 
                    wx.onMenuShareWeibo({
                        title: bookName, 
                        link: mLink ,
                        desc:mDesc,
                        imgUrl:mImgUrl ,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });

                    // 2.5 监听“分享到QZone”按钮点击、自定义分享内容及分享接口 
                    wx.onMenuShareQZone({
                        title: bookName, 
                        link: mLink ,
                        desc:mDesc,
                        imgUrl:mImgUrl ,
                        fail: function (res) {
                            layer.msg(JSON.stringify(res));
                        }
                    });
                })
            }
        })
    });
});