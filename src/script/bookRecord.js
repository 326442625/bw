/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $record = $("#book-record");
            var $deliverNum = $("#JS_deliver_num");
            var $orderNum = $("#JS_order_num");
            var $userNum = $("#JS_user_num");
            var $startTime = $("#JS_start_time");
            var $endTime = $("#JS_end_time");
            var $list = $("#list");
            var $total = $("#JS_total");
            var $name = $("#JS_book_name");
            var $publish = $("#JS_publish");
            var $price = $("#JS_price");
            var $barCode = $("#JS_bar_code");
            var $stock = $("#JS_stock");
            var $date = $("#date");
            var $wire = $(".wire");
            var $page=$("#JS_page");
            var urlBookId = $.getParam('bookId');
            var bookData = JSON.parse($.getKey('bwBookData')) || {};
            var nowDate = new Date().getFullYear();
            var dateArr = [nowDate, nowDate - 1, nowDate - 2];
            var dateHtml = '';
            $deliverNum.html(bookData.deliverNum);
            $orderNum.html(bookData.orderNum);
            $startTime.html(bookData.startTime);
            $endTime.html(bookData.endTime);
            $userNum.html(bookData.userNum);
            $name.html(bookData.bookName);
            if(!bookData.price){bookData.price=0};
            $price.html(parseFloat(bookData.price).toFixed(2));
            $publish.html(bookData.publish);
            $barCode.html(bookData.barCode);
            $stock.html(parseInt(parseFloat(bookData.stock)));
            // 获取最近年份
            $.each(dateArr, function (index, el) {
                var activeClass = index == 0 ? 'active' : '';
                dateHtml += '<a href="javascript:;" class="JS_date ' + activeClass + '" value="' + el + '">' + el + '</a>';
            })
            $date.html(dateHtml);
            // 请求获得下单记录
            $.isLogin();
            getData(1,nowDate);

            function getData(page,year) {
                var startData = year + '-01-01';
                var finishDate = year + '-12-01';
                var url='/book/' + urlBookId + '/order?start_date=' + startData + '&finish_date=' + finishDate+'&page='+page;
                $.getData({
                    type: 'get',
                    beforeGetLoading: true,
                    url: url,
                    success: function (data) {
                        callBack(data);
                        $.page({
                            data:data.data,
                            fun:getData,
                            par:year
                        })
                        data.data.data.length==0?$page.hide(): $page.show();
                    }
                })
            }

            function callBack(data) {
                var data = data.data.data;
                var html = '';
                $list.find('tr:gt(0)').remove();
                if(data.length==0){
                    html+='<tr><td colspan="3">暂无记录</td></tr>';
                }
                $.each(data, function (index, el) {
                    html += '<tr>\
                                <td>' + el.fDate.substring(0, 10) + '</td>\
                                <td>' + el.fcode + '</td>\
                                <td>' + parseInt(parseFloat(el.fh_qty)) + '</td>\
                          </tr>'
                })
                $list.append(html);
            }
            $date.on('click', '.JS_date', function () {
                var year = $(this).attr('value');
                var index = $(this).index();
                var oRem = (-310 + index * 70) * 0.017067 + 'rem';
                $(this).addClass('active').siblings().removeClass('active');
                $wire.css("background-position-x", oRem);
                getData(1,year);
            })

           
        })
    });
});