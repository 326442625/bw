/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $closed=$("#JS_closed");
            var $list=$("#JS_list")
            // 获取封闭式图书
            $.isLogin();
            $.getData({
                type: 'get',
                beforeLoading:{
                    el:$closed
                },
                url: '/list_of_books/close',
                success: function (data) {
                    var oReturn=callBack(data);
                    if(oReturn){
                        $.loadMore(data.data,'list_of_books/close',callBack);
                    } 
                }
            })
            function callBack(data){
                var data=data.data.data;
                var html='';
                if (data.length==0) {
                    html += '<div class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">没有相关数据~</p>\
                            </div>';
                    $closed.html(html);
                    return false;
                }
                $.each(data,function(index,el){
                    var time=el.fCreate_date?el.fCreate_date.substring(0,10):'';
                    html+='<div class="card">\
                             <a href="/view/bookList.html?type=3&fCode='+el.fCode+'">\
                                <i class="icon icon-recommend"></i>\
                                <p>\
                                    <span class="font-16 margin-right-5">'+el.fname+'</span>\
                                </p>\
                             </a>\
                           </div>'
                })
                $list.append(html);
                return true;
            }
        })
    });
});