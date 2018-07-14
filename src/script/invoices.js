/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common","mescroll"], function ($,MeScroll) {  
        $(function () {
            var $tab = $(".JS_tab");
            var $list = $("#JS_list");
            var $mescroll=$("#mescroll"); 
            var listData = [];
            var bwHistoryData = {};
            var invoicesStatus = $.getKey('bwInvoiceStatus')||'0';
            if (history.state && $.getKey('bwInvoiceList') && history.state.back == 'back') {
                bwHistoryData = JSON.parse($.getKey('bwInvoiceList')); 
                var current_page = bwHistoryData.current_page || 1;
                var last_page = bwHistoryData.last_page || 1;
                var scrollTop = bwHistoryData.sidebarTop || 0;
                var hListData = bwHistoryData.listData || [];
                var data = {
                    data: {
                        current_page: current_page,
                        data: hListData,
                        last_page: last_page
                    }
                }
                getData(invoicesStatus, data);
                history.replaceState({}, null, '');
                setTimeout(function () {
                    $mescroll.scrollTop(scrollTop);
                }, 0);
            } else { 
                // 请求获得单据列表
                $.isLogin();
                $.getLoading();
                getData(invoicesStatus);
            }
            var mescroll = new MeScroll("mescroll", {
                down: {
					callback: function(){
                        getData(invoicesStatus);
                    },
                    auto:false,
                    scrollbar:true
				}
            })
            function getData(filter,hisData) {
                var $loadingMore = $("#JS_loading_more");
                var $loaded = $(".JS_loaded", $loadingMore);
                if (hisData) {
                    $list.empty();
                    $loadingMore.hide();
                    $loaded.hide().prev().show();
                    $mescroll.unbind('scroll');
                    callBack(hisData);
                    $mescroll.scroll(function () {   
                        bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                        $.setKey('bwInvoiceList', JSON.stringify(bwHistoryData));
                    })
                    $.loadMore(data.data, 'contacts/invoice?filter=' + filter, callBack,'mescroll');
                    return false;
                }
                $.getData({
                    type: 'get', 
                    url: '/contacts/invoice?filter=' + filter,
                    success: function (data) {
                        var $loading = $("#JS_w_loading");
                        $loading.hide();
                        $list.empty();
                        $loadingMore.hide();
                        $loaded.hide().prev().show();
                        $mescroll.unbind('scroll'); 
                        var oReturn = callBack(data);
                        if (oReturn) {
                            $mescroll.scroll(function () {   
                                bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                $.setKey('bwInvoiceList', JSON.stringify(bwHistoryData));
                            })
                            $.loadMore(data.data, 'contacts/invoice?filter=' + filter, callBack,'mescroll');
                        }
                        mescroll.endSuccess();
                    },
                    error:function(){
                        var $loading = $("#JS_w_loading");
                        $loading.hide();
                        mescroll.endErr();
                    }
                })
            }
            function callBack(data) { 
                var current_page = data.data.current_page || 1;
                var last_page = data.data.last_page || 1;
                var data = data.data.data;
                var html = '';
                if (data.length == 0) {
                    html += ' <div id="" class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">您还没有相关单据~</p>\
                            </div>';
                    $list.append(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    listData.push(el);
                    bwHistoryData.current_page = current_page;
                    bwHistoryData.last_page = last_page;
                    bwHistoryData.listData = listData;
                    $.setKey('bwInvoiceList', JSON.stringify(bwHistoryData));
                    var invoicesType = el.fCodetype == 'XT' ? 'icon-tui' : 'icon-xiao';
                    var urlType=el.fCodetype == 'XT'?'invoicesDetail2':'invoicesDetail';
                    var fDate = el.fDate ? el.fDate : '';
                    var totalNumber=parseInt(parseFloat(el.fTotalqty))+parseInt(parseFloat(el.fSub_Totalqty));
                    var fPrice=parseFloat(el.fTotalmoney);
                    var sPrice=parseFloat(el.fSub_Totalmoney);
                    var totalRealPrice=fPrice.add(sPrice);
                    var faPrice=parseFloat(el.fTotalallmoney);
                    var saPrice=parseFloat(el.fSub_Totalallmoney);
                    var totalPrice=faPrice.add(saPrice);
                    html += '<li class="item margin-top-10 JS_link" data-url="/view/'+urlType+'.html?fCode='+el.fCode+'&shopName='+el.bookshop.Wkers_Name+'">\
                                <div class="line-40 bg-white padding-left-12 border-bottom">\
                                    <i class="icon ' + invoicesType + ' margin-right-5"></i><span class="black-4">博文批销单号：<span>' + el.fCode + '</span>\
                                </div>\
                                <div class="padding-12 border-bottom bg-white">\
                                    <p class="margin-bottom-8">\
                                        <i class="icon icon-user-home margin-right-5 margin-bottom-2"></i><span class="font-16">' + el.bookshop.Wkers_Name + '</span>\
                                    </p>\
                                    <p>\
                                        <span class="black-4">×' + totalNumber + '本</span>\
                                        <span class="f-right black-4">总码洋：¥' + totalPrice.toFixed(2) + '</span>\
                                    </p>\
                                    <p class="clearfix font-15">\
                                        <span class="f-right black">总实洋：¥' + totalRealPrice.toFixed(2) + '</span>\
                                    </p>\
                                </div>\
                                <div class="line-45 bg-white padding-left-12 padding-right-12">\
                                    <span class="gray font-13">单据时间：' + fDate.substring(0, 19).replace(/-/g, '/') + '</span>\
                                    <div class="f-right">\
                                        <a href="javascript:;" data-url="/view/'+urlType+'.html?fCode='+el.fCode+'&shopName='+el.bookshop.Wkers_Name+'" class="JS_link r-order-button padding-tb-2 width-50 JS_check font-12 height-20">查看</a>\
                                    </div>\
                                </div>\
                            </li>'
                })
                $list.append(html);
                return true;
            }
            $list.on('click','.JS_link',function(){
                var url=$(this).data('url');
                history.replaceState({
                    back: 'back'
                }, null, '');
                location.href=url;
            })
            $.tab({
                el: $tab,
                index: invoicesStatus,
                funs: [function () {
                    $.setKey('bwInvoiceStatus',0);
                    location.href="/view/invoices.html";
                }, function () {
                    $.setKey('bwInvoiceStatus',1);
                    location.href="/view/invoices.html";
                }, function () {
                    $.setKey('bwInvoiceStatus',2);
                    location.href="/view/invoices.html";
                }]
            });  
        })
    });
});