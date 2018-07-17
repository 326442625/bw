/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "swiper"], function ($, Swiper) {
        $(function () {
            var $home = $("#home");
            var $search = $("#JS_search");
            var $info = $("#JS_info");
            var $returnInfo = $("#JS_return_info");
            var $nationRank = $("#JS_nation_rank");
            var $publishRank = $("#JS_publish_rank");
            var $subscriptionBook = $("#JS_subscription_book");
            var $hotList = $("#JS_hot_list");
            var $fineList = $("#JS_fine_list");
            var $swiper = $("#JS_warpper");
            var $change = $("#JS_change");
            var $notice = $("#JS_notice");
            var $rank = $(".JS_rank"); 
            var $rankWarpper=$("#JS_rank_warpper");
            var $title=$("title");
            // 请求获得首页信息
            $.isLogin();
            // 获取首页标题
            $.getData({
                type: 'get',
                url: '/config/xm_config',
                success: function (data) {  
                    $title.html(data.data.title);
                }
            })
            // 获取首页信息
            $.getData({
                type: 'get',
                url: '/home',
                beforeLoading: {
                    el: $home
                },
                success: function (data) {   
                     // 扫一扫
                     $.getData({
                        type: 'post',
                        url: '/auth/wx_config?url=' + location.href,
                        success: function (data) {
                            callBackCode(data.data);
                        }
                    })
                    $.getData({
                        type: 'get',
                        url: '/ad_list/space_id/1',
                        success: function (data) { 
                            callBackBanner(data.data, $swiper);
                        }
                    })
                    $.getData({
                        type: 'get',
                        url: '/article_list?sort_id=1',
                        success: function (data) { 
                            callBackInfo(data.data, $info);
                        }
                    })             
                    $.getData({
                        type: 'get',
                        url: '/article_list?sort_id=2',
                        success: function (data) { 
                            callBackMsg(data.data, $returnInfo);
                        }
                    })             
                    callBackRank(data.data.rank_bowen_quanguo, $nationRank, 'd-blue', 1);
                    callBackRank(data.data.rank_bowen_publish_hot, $publishRank, 'l-blue', 2);
                    callBackRank(data.data.rank_new_book_sub, $subscriptionBook, 'p-blue', 3);
                    if(data.data.rank_bowen_quanguo.length==0&&data.data.rank_bowen_publish_hot.length==0&&data.data.rank_new_book_sub.length==0){
                        $rankWarpper.hide();
                    }
                    callBackList(data.data.hot_book, $hotList);
                    callBackList(data.data.fine_book, $fineList);
                    callBackRec();
                }
            })
            function callBackCode(data) {
                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
                    timestamp: data.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.nonceStr, // 必填，生成签名的随机串
                    signature: data.signature, // 必填，签名，见附录1
                    jsApiList: data.jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
                wx.ready(function () {
                    document.querySelector('#JS_scan').onclick = function () {
                        wx.scanQRCode({
                            desc: 'scanQRCode desc',
                            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                            success: function (res) {
                                // 回调
                                var resultStr = res.resultStr || '';
                                var resultIndex = resultStr.indexOf(',');
                                resultStr = resultStr.substring(resultIndex + 1, resultStr.length);
                                location.href = "/view/bookList.html?type=1&searchVal=" + resultStr;
                            },
                            error: function (res) {
                                if (res.errMsg.indexOf('function_not_exist') > 0) {
                                    alert('版本过低请升级')
                                }
                            }
                        });
                    };
                });
            }
            // 轮播
            function callBackBanner(data, dom) {
                var html = '';
                $.each(data, function (index, el) {
                    html += '<div class="swiper-slide">\
                            <a href="javascript:;" class="JS_banner_link" data-title="'+el.title+'" data-url="'+el.redirect_url+'"><img class="opacity-0" src="' + $.getImg(el.pic_src) + '" width="100%" height="100%"></a>\
                        </div>'
                })
                dom.html(html);
                var mySwiper = new Swiper('#JS_banner', {
                    autoplay: true, //可选选项，自动滑动
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    loop: true
                })
                var $link=dom.find('.JS_banner_link');
                $link.click(function(){
                    var url=$(this).data('url'); 
                    if(url){
                        location.href=url;
                    }
                })
            }
            // 退货通知
            function callBackMsg(data, dom) { 
                if (data.data.length == 0) {
                    dom.parent().parent().hide();
                }
                var html = ''; 
                var nowDate=new Date().getTime();
                $.each(data.data, function (index, el) {
                    var time=el.add_time||0;
                    var newClass='no-show';
                    if(time*1000+86400000*3>=nowDate){
                        newClass='';
                    }
                    html += '<p class="text-over">\
                                    <a class="JS_msg_link" href="javascript:;" data-id="'+el.id+'" url="'+el.redirect_url+'">\
                                        <i class="icon icon-new2 margin-right-5 '+newClass+'"></i><span class="desc">'+el.title+'</span>\
                                    </a>\
                            </p>'
                }) 
                dom.html(html);
                var $link=dom.find('.JS_msg_link');
                $link.click(function(){
                    var id=$(this).data('id');
                    var url=$(this).data('url');
                    if(url){
                        location.href=url;
                        return false;
                    }
                    location.href='/view/newsDetail.html?catId=2&id='+id;
                })
            }

            // 博文咨询
            function callBackInfo(data, dom) { 
                if (data.data.length == 0) {
                    dom.parent().hide();
                }
                var html = '';
                $.each(data.data, function (index, el) {
                    var classFloat = index == 1 ? 'f-right' : 'f-left';
                    html += '<div class="swiper-slide ' + classFloat + '">\
                                <a class="JS_info_link" href="javascript:;" data-id="'+el.id+'" data-url="'+el.redirect_url+'">\
                                    <div class="img-warpper text-center">\
                                        <img src="' + $.getImg(el.pic_src) + '_170x100" width="100%" height="100%">\
                                    </div>\
                                    <p>' + el.title + '</p>\
                                </a>\
                            </div>'          
                })
                dom.html(html);
                var mySwiper = new Swiper('#JS_news', {
                    freeMode : true, 
                    slidesPerView : 'auto'
                })
                var $link=dom.find('.JS_info_link');
                $link.click(function(){
                    var id=$(this).data('id');
                    var url=$(this).data('url');
                    if(url){
                        location.href=url;
                        return false;
                    }
                    location.href='/view/newsDetail.html?catId=1&id='+id;
                })
            }
            // 排行
            function callBackRank(data, dom, classRank, type) {
                if (data.length == 0) {
                    dom.parent().hide();
                }
                var html = '';
                $.each(data, function (index, el) {
                    if (index == 2) {
                        return false;
                    }
                    html += '<p class="text-over">\
                                <span class="' + classRank + '">' + (index + 1) + '.</span><span>' + el.fTitle + '</span>\
                             </p>'
                })
                html += '<p class="text-over">\
                        <span class="' + classRank + '">...</span>\
                       </p>'
                dom.html(html);
            }
            $rank.click(function () {
                var index = $(this).index();
                location.href = '/view/rank.html?type=' + index;
            })
            // 热销书单和精品书单
            function callBackList(data, dom) {
                if (data.length == 0) {
                    dom.parents('.book-list').hide();
                }
                var html = '';
                $.each(data, function (index, el) {
                    var bookAuthor = el.H_writer ? el.H_writer : '---';
                    html += '<li class="f-left JS_detail w-col-8">\
                              <a href="/view/bookDetail.html?bookId=' + el.H_id + '">\
                                <p class="text-center"><img src="' + CONST.BaseBookImg + '/' + el.H_images + '_210x280" height="100%"></p>\
                                <p class="book-name margin-top-4">' + el.H_name + '</p>\
                                <p class="gray font-12 margin-top-8">' + bookAuthor + '</p>\
                              </a>\
                           </li>'
                })
                dom.html(html);
            }
            // 换一换
            $change.click(function () {
                $.getData({
                    type: 'get',
                    url: '/home/fine_books/random',
                    success: function (data) {
                        callBackList(data.data, $fineList);
                    }
                })
            })
            // 搜索
            $search.click(function () {
                location.href = "/view/search.html"
            })
            // 导航推荐
            function callBackRec() {
                var $drap = $("#JS_drap");
                var $meun = $(".menu");
                var $list = $("#JS_rec_list");
                var $meunLink = $(".JS_menu a");
                var $navLink = $("#JS_recommend_tab .swiper-wrapper a");
                var $navItem = $("#JS_recommend_tab .item");
                var $empty = $("#JS_empty");
                var $loading2 = $(".JS_loading_more2");
                // 请求获得模块列表
                getData([3, 2]);

                function getData(fLooker) {
                    var param = '';
                    $.each(fLooker, function (index, el) {
                        param = param + 'fLooker[' + index + ']=' + el + '&';
                    })
                    $.getData({
                        type: 'get',
                        before: function () {
                            $loading2.show();
                            $empty.hide();
                            $list.hide();
                        },
                        url: '/list_of_books/santong?' + param + 'limit=3',
                        success: function (data) {
                            $loading2.hide();
                            callBack(data.data);
                        }
                    })
                }

                function callBack(data) {
                    var data = data.data;
                    var html = '';
                    if (data.length == 0) {
                        $list.hide();
                        $empty.fadeIn();
                        return false;
                    }
                    $.each(data, function (index, el) {
                        if (index == 3) {
                            return false;
                        }
                        html += '<div class="card">\
                                   <a href="/view/bookList.html?type=8&ftitle='+el.ftitle+'&fCode=' + el.fcode + '">\
                                      <i class="icon icon-recommend"></i>\
                                      <p>\
                                          <span class="font-16 margin-right-5">' + el.ftitle + '</span>\
                                      </p>\
                                   </a>\
                                 </div>'
                    })
                    html += '<p class="margin-top-15 text-center">\
                            <a href="/view/recommend.html" class="gray">查看更多</a>\
                          </p>'
                    $list.html(html); 
                    $list.fadeIn();
                }
                $drap.click(function (e) {
                    e.stopPropagation();
                    $meun.fadeToggle();
                })
                $(document).click(function () {
                    $meun.fadeOut();
                })
                $navItem.click(function () {
                    var fLooker = $(this).children().attr('flooker');
                    var fLookerArr = [];
                    if (fLooker == 'all') {
                        fLookerArr = [3, 2];
                    } else if (fLooker == 3) {
                        fLookerArr = [3];
                    } else {
                        fLookerArr = [2];
                    }
                    $(this).siblings().children('a').removeClass('active');
                    $(this).children('a').addClass('active');
                    getData(fLookerArr);
                })
                $meunLink.click(function () {
                    var index = $(this).parent().index();
                    var fLooker = $navItem.eq(index).children().attr('flooker');
                    var fLookerArr = [];
                    if (fLooker == 'all') {
                        fLookerArr = [3, 2];
                    } else if (fLooker == 3) {
                        fLookerArr = [3];
                    } else {
                        fLookerArr = [2];
                    }
                    $navItem.eq(index).siblings().children('a').removeClass('active');
                    $navItem.eq(index).children('a').addClass('active');
                    getData(fLookerArr);
                })
            }
        })

    });
});