/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var id = $.getParam('id');
            var type = $.getParam('type');
            var categoryId=$.getParam('catId');
            var $title=$("title");
            var $news = $("#news-detail"); 
            var bwBanner=$.getKey('bwBanner');
            if(categoryId=='1'){
                $title.html('博文资讯');
            }else if(categoryId=='2'){
                $title.html('博文退货通知');
            }else{
                $title.html('博文广告'); 
            } 
            if(id=='2'){
                $title.html('博文服务协议');
            } 
            // 请求获得咨询详情
            $.isLogin();
            $.getData({
                type: 'get',
                beforeLoading: {
                    el: $news
                },
                url: '/article2/'+id,
                success: function (data) { 
                    if(data.data.redirect_url){
                        location.href=data.data.redirect_url;
                    }
                    callBack(data.data);
                    var html='<a href="/view/bookList.html?type=9&id='+data.data.id+'" id="JS_check" class="red-botton f-right"><i class="icon icon-banner-detail margin-right-5"></i>点击下单</a>'
                    var $fix=$(".JS_fixed");
                    if(data.data.arr_book_id){
                        $fix.append(html).removeClass('text-center').prev().removeClass('text-center');
                    }
                }
            })

            function callBack(data) {
                var annexClass=data.file_url?'':'disn';  
                var html = '';
                html += '<div class="warpper bg-white">\
                            <div class="fixed-top">\
                                <h1 class="font-18 text-center">' + data.title + '</h1>\
                                <p class="time JS_fixed gray text-center">发布时间：' + $.timeStamp(data.add_time*1000) + '</p>\
                            </div>\
                            <div class="content-warpper">\
                                ' + $.getImg(data.content)+ '\
                            </div>\
                            </div>\
                            <div class="bg-white margin-top-20 line-50 padding-left-12 '+annexClass+'">\
                                <i class="icon icon-accessory"></i>\
                                <span class="font-16 black">附件：</span><a href="'+$.getImg(data.file_url)+'" class="gray dec font-15">' + data.file_title + '</a>\
                            </div>\
                        <div id="wlb"><a href="http://www.weilaba.com">微喇叭提供技术支持</a></div>'
                $news.html(html);
                var $fixTop=$('.fixed-top'); 
                var $warpper=$('.warpper'); 
                $warpper.css('padding-top',$fixTop.outerHeight());
            }
        })
    });
});