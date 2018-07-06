/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var type=$.getParam('type');
            var $list=$("#JS_list");
            var $title=$("#JS_title");
            var $header=$("#JS_header");
            if(type==1){
                getData([5]);
                $header.removeClass('rank2').removeClass('rank3');
                $title.html('博文&全国排行榜');
            }else if(type==2){
                getData([0]);
                $header.addClass('rank2').removeClass('rank3');
                $title.html('出版社全国销售排行榜');
            }else if(type==3){
                getData([4]);
                $header.addClass('rank3').removeClass('rank2');
                $title.html('出版新书征订');
            }
            function getData(fLooker) {
                var param='';
                $.each(fLooker, function (index, el) {
                    param = param + 'fLooker[' + index + ']=' + el + '&';
                })
                $.getData({
                    type: 'get',
                    beforeGetLoading:true,
                    url: '/list_of_books/santong?'+param,
                    success: function (data) {
                        var oReturn = callBack(data);
                        if (oReturn) {
                            $.loadMore(data.data, 'list_of_books/santong?'+param, callBack);
                        }
                    }
                })
            }
            function callBack(data){
                var data=data.data.data;
                var html='';
                $.each(data,function(index,el){
                    html+='<div class="card clearfix bg-white">\
                                <a href="/view/bookList.html?rank=1&type=8&fCode=' + el.fcode + '">\
                                    <div class="f-left">\
                                        <i class="icon icon-rank-detail"></i>\
                                    </div>\
                                    <div class="f-left margin-left-10">\
                                        <p class="font-16">'+el.ftitle+'</p>\
                                    </div>\
                                </a>\
                            </div>'
                })
                $list.append(html);
                return true;
            }
        })
    });
});