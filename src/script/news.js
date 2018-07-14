/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common","mescroll"], function ($,MeScroll) {
        $(function () {
            var $news = $("#news");
            var $list = $("#JS_list");
            var $title=$("title");
            var $mescroll=$("#mescroll"); 
            var categoryId=$.getParam('catId');
            if(categoryId=='2'){
                $title.html('博文退货通知');
            }
            // 请求获得咨询列表
            $.isLogin(); 
            layer.load();  
            function getData(){ 
                $.getData({
                    type: 'get',
                    url: '/article_list?sort_id='+categoryId,
                    success: function (data) {
                        var $loadingMore = $("#JS_loading_more");
                        var $loaded = $(".JS_loaded", $loadingMore);
                        $loaded.hide().prev().show();
                        $list.empty();
                        layer.closeAll('loading');
                        $news.fadeIn();
                        var oReturn=callBack(data);
                        if(oReturn){
                            $.loadMore(data.data,'article_list?sort_id='+categoryId,callBack,'mescroll');
                        } 
                        mescroll.endSuccess();
                    },
                    error:function(){
                        layer.closeAll('loading');
                        $news.fadeIn();
                        mescroll.endErr();
                    }
                })
            }
            var mescroll = new MeScroll("mescroll", {
                down: {
					callback: function(){
                        getData();
                    },
                    scrollbar:true
				}
            })
            function callBack(data) {
                var data=data.data.data;
                var html = '';
                if (data.length==0) {
                    html += '<div class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">没有相关信息~</p>\
                            </div>';
                    $list.append(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    html += '<div class="warpper clearfix bg-white" data-time="'+el.add_time*1000+'">\
                                <div class="f-left">\
                                <a href="javascript:;" class="JS_info_link" data-id="'+el.id+'" data-url="'+el.redirect_url+'">\
                                    <h4 class="title font-16 black">\
                                            <i class="icon icon-new"></i>\
                                            ' + el.title + '\
                                    </h4>\
                                    <p class="margin-top-20 gray font-12">\
                                       <span class="margin-right-25">' + $.timeStamp(el.add_time*1000) + '</span>\
                                       <i class="icon icon-see margin-right-5"></i><span>' + el.view_num + '</span>\
                                    </p>\
                                </div>\
                                <div class="f-right img-warpper text-center">\
                                    <img src="'+$.getImg(el.pic_src)+'_180x180" width="100%" height="100%">\
                                </div>\
                                </a>\
                            </div>' 
                })
                $list.append(html);
                var $link=$list.find('.JS_info_link');
                var $warpper=$list.find('.warpper');
                $link.click(function(){
                    var id=$(this).data('id');
                    var url=$(this).data('url');
                    if(url){
                        location.href=url;
                        return false;
                    }
                    location.href='/view/newsDetail.html?catId='+categoryId+'&id='+id;
                })
                $warpper.each(function(){
                    var time=$(this).data('time');
                    var nowDate=new Date().getTime();
                    if(parseInt(time)+86400000*3>=nowDate){
                        $(this).addClass('new');
                    }
                }) 
                return true;
            }
 
        })
    });
});