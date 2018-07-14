/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "date","mescroll"], function ($,date,MeScroll) {
        $(function () {
            var $loading = $("#JS_loading");
            var $view = $("#JS_view");
            var $list = $("#JS_list");
            var $timeShow = $("#JS_show_time");
            var $rankTime = $("#JS_rank_time");
            var $timeWarpper = $(".time-warpper");
            var $aTime = $timeWarpper.find('.time');
            var $sale = $("#JS_sale");
            var $timeSubmit = $("#JS_time_submit");
            var $startTime = $("#JS_start_time");
            var $endTime = $("#JS_end_time");
            var $title = $("#JS_book_title");
            var $mescroll=$("#mescroll"); 
            var type = $.getParam('type');
            var searchVal = $.getParam('searchVal', decodeURI(location.href));
            var filterParam='sale=0';
            var timeParam = {
                H_update_date: {}
            };
            var isTimeStart=false;
            var listData = [];
            var bwHistoryData={}; 
            if (history.state && $.getKey('bwBookList')&&history.state.back=='back') { 
                bwHistoryData = JSON.parse($.getKey('bwBookList'));   
                var current_page=bwHistoryData.current_page||1;
                var last_page=bwHistoryData.last_page||1;
                var scrollTop=bwHistoryData.sidebarTop||0; 
                var hListData=bwHistoryData.listData||[];
                var startTime=bwHistoryData.startTime||'';
                var endTime=bwHistoryData.endTime||'';
                var timeShow=bwHistoryData.timeShow||false;
                var timeIndex=bwHistoryData.timeIndex;
                var timeClass=bwHistoryData.timeClass||'';
                var viewClass=bwHistoryData.viewClass||'';
                var saleClass=bwHistoryData.saleClass||'';
                filterParam=bwHistoryData.filterParam||'sale=0';
                timeParam=bwHistoryData.timeParam||{H_update_date: {}};
                var data={
                    data:{current_page:current_page,data:hListData,last_page:last_page}
                }  
                if(timeShow){
                    $timeWarpper.show();
                    $timeShow.find('i').toggleClass('icon-g-bottom');
                }
                if(startTime){
                    $startTime.val(startTime);
                }
                if(endTime){
                    $endTime.val(endTime);
                }
                if(saleClass){
                    $sale.find('a').attr('class',saleClass);
                } 
                if((timeIndex||timeIndex==0)&&timeClass.indexOf('active')!==-1){  
                    $aTime.eq(timeIndex).addClass('active');
                }
                if(viewClass.indexOf('single')!==-1){
                    $list.addClass('single');  
                    $view.children('i').addClass('icon-view2');
                }
                getAllData(filterParam, timeParam ,data);
                history.replaceState({}, null, '');
                setTimeout(function() { 
                    $mescroll.scrollTop(scrollTop);
                }, 0);
            }else{
                if (type == 4) { //新书上架默认当天
                    var nowDate = new Date().getTime();
                    $aTime.eq(0).addClass('active');
                    $timeWarpper.show();
                    $timeShow.find('i').removeClass('icon-g-bottom');
                    timeParam.H_update_date.startTime = $.timeStamp(nowDate).substring(0, 10).replace(/\//g, '-');
                    timeParam.H_update_date.endTime = $.timeStamp(nowDate).substring(0, 10).replace(/\//g, '-');
                    bwHistoryData.timeIndex=0;
                    bwHistoryData.timeClass='active';
                    bwHistoryData.timeParam=timeParam;
                    bwHistoryData.timeShow=true;
                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                }
                $.isLogin();
                $.getLoading();
                getAllData(filterParam, timeParam);
            }
            var mescroll = new MeScroll("mescroll", {
                down: {
					callback: function(){
                        getAllData(filterParam, timeParam);
                    },
                    auto:false ,
                    scrollbar:true
				}
            })
            // 销量排行
            $sale.click(function () {
                var $a = $(this).find('a');
                var isBottom = $a.attr('class').indexOf('active-bottom') !== -1;
                if (isBottom) {
                    filterParam = 'order_column=h_saleqty&order_direction=asc';
                    $a.removeClass('active-bottom').addClass('active-top');
                    $.getLoading();
                    getAllData(filterParam, timeParam);
                } else {
                    filterParam = 'order_column=h_saleqty&order_direction=desc';
                    $a.addClass('active-bottom').removeClass('active-top');
                    $.getLoading();
                    getAllData(filterParam, timeParam);
                }
                bwHistoryData.filterParam=filterParam;
                bwHistoryData.saleClass=$a.attr('class');
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
            // 上架时间
            $rankTime.click(function () {
                $timeWarpper.slideToggle();
                $(this).find('i').toggleClass('icon-g-bottom');
                bwHistoryData.timeShow=!$timeWarpper.is(":hidden");
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
            $timeSubmit.click(function () {
                timeParam.H_update_date.startTime = '';
                timeParam.H_update_date.endTime = '';
                if ($.trim($startTime.val()) && !$.trim($endTime.val())) {
                    layer.msg('请选择结束时间~');
                    return false;
                } else if (!$.trim($startTime.val()) && $.trim($endTime.val())) {
                    layer.msg('请选择开始时间~');
                    return false;
                } else if ($.trim($startTime.val()) && $.trim($endTime.val())) {
                    timeParam.H_update_date.startTime = $startTime.val();
                    timeParam.H_update_date.endTime = $endTime.val();
                }
                timeParam.H_update_date.startTime = timeParam.H_update_date.startTime.replace(/\//g, '-');
                timeParam.H_update_date.endTime = timeParam.H_update_date.endTime.replace(/\//g, '-');
                $.getLoading();
                getAllData(filterParam, timeParam);
                bwHistoryData.timeParam=timeParam; 
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
            $aTime.click(function () {
                if(!isTimeStart){
                    layer.msg('操作太快了~');
                    return false;
                }
                isTimeStart=false;
                $startTime.val('');
                $endTime.val('');
                $(this).toggleClass('active').siblings().removeClass('active');
                var index = $(this).index();
                var nowDate = new Date().getTime();
                var beforeDate = 0;
                var isChecked = $(this).attr('class').indexOf('active') !== -1;
                switch (index) {
                    case 0:
                        beforeDate = nowDate;
                        break;
                    case 1:
                        beforeDate = nowDate - 86400000 * 3;
                        break;
                    case 2:
                        beforeDate = nowDate - 86400000 * 7;
                        break;
                    case 3:
                        beforeDate = nowDate - 86400000 * 30;
                        break;
                }
                if(isChecked){
                    timeParam.H_update_date.startTime = $.timeStamp(beforeDate).substring(0, 10).replace(/\//g, '-');
                    timeParam.H_update_date.endTime = $.timeStamp(nowDate).substring(0, 10).replace(/\//g, '-');
                }else{
                    timeParam.H_update_date.startTime ='';
                    timeParam.H_update_date.endTime ='';
                }
                $.getLoading();
                getAllData(filterParam, timeParam);
                bwHistoryData.timeParam=timeParam;
                bwHistoryData.startTime='';
                bwHistoryData.endTime='';
                bwHistoryData.timeIndex=index;
                bwHistoryData.timeClass=$(this).attr('class');
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
            $startTime.change(function () {
                $aTime.removeClass('active'); 
                bwHistoryData.timeIndex=null;
                bwHistoryData.startTime=$(this).val();
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
            $endTime.change(function () {
                $aTime.removeClass('active'); 
                bwHistoryData.timeIndex=null;
                bwHistoryData.endTime=$(this).val();
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
            // 日期
            $startTime.mobiscroll().date({
                theme: "ios",
                mode: "scroller",
                display: "bottom",
                lang: "zh",
                maxDate: new Date(2050, 7, 30, 15, 44)
            });
            $endTime.mobiscroll().date({
                theme: "ios",
                mode: "scroller",
                display: "bottom",
                lang: "zh",
                maxDate: new Date(2050, 7, 30, 15, 44)
            });

            function getAllData(filterParam, timeParam,hisData) {
                listData = [];
                var param = {};
                var timeUrl = '';
                // 上架时间
                if (timeParam.H_update_date.startTime && timeParam.H_update_date.endTime) {
                    timeUrl = '&f[10][column]=H_update_date&f[10][operator]=between&f[10][query_1]=' + timeParam.H_update_date.startTime+' 00:00:00' + '&f[10][query_2]=' + timeParam.H_update_date.endTime+' 23:59:59';
                }
                if (type == 1) { // 普通搜索
                    var param = 'flag=simple&f[0][filter_match]=or&f[0][column]=H_isbn&f[0][operator]=contains&f[0][query_1]=' + searchVal + '&f[1][filter_match]=or&f[1][column]=h_barcode&f[1][operator]=contains&f[1][query_1]=' + searchVal + '&f[2][filter_match]=or&f[2][column]=H_writer&f[2][operator]=contains&f[2][query_1]=' + searchVal + '&f[3][filter_match]=or&f[3][column]=h_publish&f[3][operator]=contains&f[3][query_1]=' + searchVal + '&f[4][filter_match]=or&f[4][column]=H_name&f[4][operator]=contains&f[4][query_1]=' + searchVal + timeUrl;
                    $title.html('书单');
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, 'book_list?type=search&' + param + '&' + filterParam, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/book_list?type=search&' + param + '&' + filterParam,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, 'book_list?type=search&' + param + '&' + filterParam, callBack,'mescroll');
                            }   
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 2) { // 高级搜索
                    var searchData = JSON.parse(searchVal);
                    var i = 0;
                    var urlParam = '';
                    $title.html('书单');
                    $.each(searchData, function (key, value) {
                        param['f[' + i + '][column]'] = key;
                        param['f[' + i + '][operator]'] = 'equal_to';
                        param['f[' + i + '][query_1]'] = value;
                        if (key == 'H_name') {
                            param['f[' + i + '][operator]'] = 'contains';
                        }
                        if (key == 'H_qty_zero') {
                            param['f[' + i + '][operator]'] = 'stock_no_zero';
                        }
                        if (key == 'H_price' && !value.maxPrice) {
                            param['f[' + i + '][operator]'] = 'greater_than';
                            param['f[' + i + '][query_1]'] = value.minPrice;
                        }
                        if (key == 'H_price' && !value.minPrice) {
                            param['f[' + i + '][operator]'] = 'less_than';
                            param['f[' + i + '][query_1]'] = value.maxPrice;
                        }
                        if (key == 'H_price' && value.minPrice && value.maxPrice) {
                            param['f[' + i + '][operator]'] = 'between';
                            param['f[' + i + '][query_1]'] = value.minPrice;
                            param['f[' + i + '][query_2]'] = value.maxPrice;
                        }
                        if (key == 'H_update_date' && !value.endTime) {
                            param['f[' + i + '][operator]'] = 'greater_than';
                            param['f[' + i + '][query_1]'] = value.startTime.replace(/\//g, '-')+' 00:00:00';
                        }
                        if (key == 'H_update_date' && !value.startTime) {
                            param['f[' + i + '][operator]'] = 'less_than';
                            param['f[' + i + '][query_1]'] = value.endTime.replace(/\//g, '-')+' 23:59:59';
                        }
                        if (key == 'H_update_date' && value.startTime && value.endTime) {
                            param['f[' + i + '][operator]'] = 'between';
                            param['f[' + i + '][query_1]'] = value.startTime.replace(/\//g, '-')+' 00:00:00';
                            param['f[' + i + '][query_2]'] = value.endTime.replace(/\//g, '-')+' 23:59:59';
                        }
                        i++;
                    })
                    $.each(param, function (key, value) {
                        urlParam = urlParam + key + '=' + value + '&';
                    })
                    urlParam = urlParam.substring(0, urlParam.length - 1);
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(hisData.data, 'book_list?type=search&' + urlParam + '&' + filterParam + timeUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/book_list?type=search&' + urlParam + '&' + filterParam + timeUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, 'book_list?type=search&' + urlParam + '&' + filterParam + timeUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 3) { //封闭式书单
                    $title.html('封闭式图书');
                    var fCode = $.getParam('fCode');
                    var reqUrl = 'book_list?type=search&f[0][column]=h_group&f[0][operator]=equal_to&f[0][query_1]=' + fCode + '&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/' + reqUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 4) { //新书
                    $title.html('新书上架');
                    var reqUrl = 'book_list?type=search&f[0][column]=H_newbook&f[0][operator]=equal_to&f[0][query_1]=1&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/' + reqUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 5) { //我的关注
                    $title.html('我的关注');
                    var reqUrl = 'book_list?type=favorite&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/' + reqUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 6) { //我的足迹
                    $title.html('我的足迹');
                    var reqUrl = 'book_list?type=track&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get',
                        url: '/' + reqUrl, 
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 7) { //近期热销
                    $title.html('近期热销');
                    var reqUrl = 'book_list?type=hot_book&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/' + reqUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                } else if (type == 8) { //推荐书单
                    var fCode = $.getParam('fCode');
                    var reqUrl = 'book_list?type=bowen_topic&bowen_topic_id=' + fCode + '&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/' + reqUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            $loaded.hide().prev().show();
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                }  else if (type == 9) { //咨询书单
                    var id = $.getParam('id');
                    var reqUrl = 'book_list?type=article&article_id=' + id + '&' + filterParam + timeUrl;
                    if(hisData){
                        callBack(hisData);
                        $mescroll.unbind('scroll');
                        $mescroll.scroll(function () {   
                            bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                            $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                        })
                        $.loadMore(data.data, reqUrl, callBack,'mescroll');
                        return false;
                    }
                    $.getData({
                        type: 'get', 
                        url: '/' + reqUrl,
                        success: function (data) {
                            var $loadingMore = $("#JS_loading_more");
                            var $loaded = $(".JS_loaded", $loadingMore);
                            $list.empty();
                            $loadingMore.hide(); 
                            var oReturn = callBack(data);
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            $loaded.hide().prev().show();
                            mescroll.endSuccess();
                            if (oReturn) {
                                $mescroll.unbind('scroll');
                                $mescroll.scroll(function () {   
                                    bwHistoryData.sidebarTop = $mescroll.scrollTop(); 
                                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                                })
                                $.loadMore(data.data, reqUrl, callBack,'mescroll');
                            }
                        },
                        error:function(){
                            var $loading = $("#JS_w_loading");
                            $loading.hide();
                            mescroll.endErr();
                        }
                    })
                }
            }

            function callBack(data) {
                var urlRank = $.getParam('rank');
                var rankPage;
                urlRank == 1 ? rankPage = data.data.current_page : 2; 
                bwHistoryData.current_page=data.data.current_page||1;
                bwHistoryData.last_page=data.data.last_page||1;
                isTimeStart=true;
                var data = data.data.data;
                var html = '';
                if (data.length == 0) {
                    html += '<div class="empty-status text-center">\
                                <img src="/images/empty-order.png">\
                                <p class="gray">没有相关数据~</p>\
                            </div>';
                    $list.html(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    listData.push(el);
                    bwHistoryData.listData=listData;
                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                    var bookId = el.H_id;
                    var iconMark = el.marketing_policy ? '' : 'no-show';
                    var publishDate = el.H_publish_date ? el.H_publish_date : '';
                    var writer = el.H_writer ? el.H_writer : '--';
                    var discount1 = el.discount_1 ? el.discount_1 : '110';
                    var discount2 = el.discount_2 ? el.discount_2 : '110';
                    var discount1Class=el.discount_2 ? '' : 'right-12';
                    var hStock = el.STOCK ? el.STOCK : '-1';
                    var saleqty = el.h_saleqty ? el.h_saleqty : 0;
                    var rankClass = 'disn';
                    if (urlRank == 1 && index < 3 && rankPage == 1) {
                        rankClass = '';
                    }
                    html += '<div class="book-warpper bg-white">\
                                <a class="JS_link" href="javascript:;" data-id="'+el.H_id+'">\
                                    <div class="img-warpper text-center">\
                                        <span class="icon text-center icon-rank-book ' + rankClass + '">' + (index + 1) + '</span>\
                                        <img class="opacity-0" src="' + CONST.BaseBookImg + '/' + el.H_images + '_350x350" height="100%">\
                                    </div>\
                                    <div class="padding-8 padding-top-6 desc">\
                                        <p class="serial_number text-over disn"><strong class="black">【' + el.h_barcode + '】</strong></p>\
                                        <p class="title">' + el.H_name + '</p>\
                                        <p class="margin-top-5 disn">\
                                            <a href="javascript:;" class="grayc msg">' + el.H_Typename + '</a>\
                                        </p>\
                                        <p class="margin-top-4 margin-bottom-4">\
                                            <a href="javascript:;" class="JS_discount coupon '+discount1Class+' red font-12 margin-right-5">' + parseFloat(discount1) / 10 + '折</a><a href="javascript:;" class="JS_discount coupon coupon-2 red font-12">' + parseFloat(discount2) / 10 + '折</a><i class="icon icon-marketing margin-left-4 ' + iconMark + '" >&nbsp;</i>\
                                        </p>\
                                        <p class="sku grayc font-12">\
                                            <span>定价:<span class="red">￥<strong class="font-14">' + $.getPrice(parseFloat(el.H_price).toFixed(2)).qPrice + '</strong>' + $.getPrice(parseFloat(el.H_price).toFixed(2)).hPrice + '</span></span><span class="store margin-left-5">库存<span data-stock="' + parseInt(parseFloat(hStock)) + '" class="JS_stock">' + parseInt(parseFloat(hStock)) + '</span>本</span><a href="javascript:;" class="JS_check f-right check" id="' + el.H_id + '"><i class="icon icon-check"></i>\</a>\
                                        </p>\
                                        <p class="disn font-12 black-a">' + el.h_publish + '</p>\
                                    </div>\
                                    <div class="detail ts-3 bg-white JS_detail click-h">\
                                        <div class="clearfix action-bar">\
                                            <a href="javascript:;" class="f-left bg-pink white JS_collect operate" bookId="' + el.H_id + '">关注</a>\
                                            <a href="javascript:;" class="f-left bg-red white operate JS_cart" bookId="' + el.H_id + '">加入购物车</a>\
                                        </div>\
                                        <a href="javascript:;" class="JS_detail_click">\
                                        <div class="info">\
                                        <p class="text-over">\
                                            <span class="grayc">出版社:</span>\
                                            <span class="black-4">' + el.h_publish + '</span>\
                                        </p>\
                                        <p class="margin-top-5 text-over">\
                                            <span class="grayc">作者:</span>\
                                            <span>' + writer + '</span>\
                                        </p>\
                                        <p class="margin-top-5 text-over">\
                                            <span class="grayc">出版日期:</span>\
                                            <span>' + publishDate.substring(0, 10) + '</span>\
                                        </p>\
                                    </div>\
                                    <div class="margin-top-6 clearfix text-center font-12 margin-right-15">\
                                        <div class="w-col-8 JS_discount2">\
                                            <p class="red">' + parseInt(discount1) + '%</p>\
                                            <p>折扣</p>\
                                        </div>\
                                        <div class="w-col-8">\
                                            <p class="red"><span class="JS_stock2">' + parseInt(parseFloat(hStock)) + '本</p>\
                                            <p>库存</p>\
                                        </div>\
                                        <div class="w-col-8">\
                                            <p class="red"><span class="JS_order_num">' + parseInt(saleqty) + '</span>本</p>\
                                            <p>成交</p>\
                                        </div>\
                                    </div>\
                                        </a>\
                                    </div>\
                                </a>\
                            </div>'
                })
                $list.append(html);
                init();
                return true;
            }
          
            function init() {
                var $check = $(".JS_check");
                var $detail = $(".JS_detail");
                var $detailClick = $(".JS_detail_click");
                var $cart = $(".JS_cart");
                var $collect = $(".JS_collect");
                var $discount = $(".JS_discount");
                var $discount2 = $(".JS_discount2");
                var isShowDiscount = $.getKey('bwDiscount');
                var $stock = $(".JS_stock");
                var $stock2 = $(".JS_stock2"); 
                var $link=$(".JS_link");
                if (isShowDiscount == 0) {
                    $discount.addClass('no-show');
                    $discount2.hide();
                } else if (!isShowDiscount) {
                    $.getData({
                        type: 'get',
                        url: '/me/discount',
                        success: function (data) {
                            if (data.data.is_show_discount == 0) {
                                $discount.addClass('no-show');
                                $discount2.hide();
                            }
                        }
                    })
                }
                $link.click(function(){
                    var bookId=$(this).data('id');
                    history.replaceState({back:'back'}, null, '');
                    location.href="/view/bookDetail.html?bookId="+bookId;
                })
                $discount.each(function () {
                    if ($(this).html().indexOf('11折') !== -1) {
                        $(this).hide();
                    }
                })
                $discount2.each(function () {
                    if ($(this).html().indexOf('110%') !== -1) {
                        $(this).hide();
                    }
                })
                $stock.each(function () {
                    var val = $(this).html();
                    var newVal = parseFloat(val).mul(0.0001);
                    if (val.indexOf('-1') !== -1) {
                        $(this).parent().addClass('no-show');
                    } else if (parseFloat(val) >= 10000) {
                        $(this).html(newVal.toFixed(1) + 'w');
                    }
                })
                $stock2.each(function () {
                    if ($(this).html().indexOf('-1') !== -1) {
                        $(this).parent().parent().hide();
                    }
                })
                $check.unbind('click');
                $view.unbind('click');
                $cart.unbind('click');
                $detailClick.unbind('click');
                $collect.unbind('click');
                $detailClick.on('click', function (e) {
                    $detail.removeClass('show');
                })
                $check.click(function (e) {
                    e.stopPropagation();
                    var bookId = $(this).attr('id');
                    var myDetail = $(this).parents('.book-warpper').find('.detail');
                    var collect = $(this).parents('.book-warpper').find('.JS_collect');
                    if (!collect.data('favorite')) {
                        $.getData({
                            type: 'get',
                            url: '/favorite/' + bookId,
                            success: function (data) {
                                if (data.data.value) {
                                    collect.html('已关注').data('favorite', true);
                                }
                            }
                        })
                    }
                    $detail.addClass('ts-3');
                    $detail.removeClass('show');
                    myDetail.addClass('show');
                })
                $collect.click(function (e) {
                    e.stopPropagation(); 
                    var _this = $(this);
                    var bookId = _this.attr('bookId');
                    var parentIndex=_this.parents('.book-warpper').index();
                    var isFavorite=_this.data('favorite'); 
                    if(isFavorite){
                        $.getData({
                            type: 'delete',
                            url: '/favorite/' + bookId,
                            success: function (data) {
                                layer.msg(data.msg); 
                                _this.html('关注').data('favorite', false);
                            }
                        }) 
                        return false;
                    }
                    $.getData({
                        type: 'post',
                        url: '/favorite',
                        param: {
                            book_id: bookId
                        },
                        success: function (data) {
                            layer.msg(data.msg);
                            _this.html('已关注').data('favorite', true); 
                        }
                    })
                })
                $cart.click(function (e) {
                    e.stopPropagation();
                    var bookId = $(this).attr('bookId');
                    var stock = parseFloat($(this).parents('.book-warpper').find(".JS_stock").data('stock'));
                    if (stock == 0) {
                        layer.msg('库存不足~');
                        return false;
                    }
                    $.getData({
                        type: 'put',
                        url: '/cart',
                        param: {
                            book_id: bookId,
                            qty: 1,
                            qty_sub: 0
                        },
                        success: function (data) {
                            if (data.code == 201) {
                                layer.msg('成功加入购物车~');
                            }
                        }
                    })
                })
                $view.click(function () {
                    var $img=$('img');
                    $img.removeClass('fadeIn');
                    $detail.removeClass('ts-3');
                    $(this).children('i').toggleClass('icon-view2');
                    $list.toggleClass('single'); 
                    bwHistoryData.viewClass=$list.attr('class');
                    $.setKey('bwBookList', JSON.stringify(bwHistoryData));
                })
            } 
            $(document).scroll(function(){
                bwHistoryData.sidebarTop=$(window).scrollTop();
                $.setKey('bwBookList', JSON.stringify(bwHistoryData));
            })
        })
    });
});