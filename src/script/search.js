/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $advancedSearch = $("#JS_advanced_search");
            var $search = $("#JS_search");
            var $history = $("#JS_history");
            var $scan = $("#JS_scan");
            $advancedSearch.click(function () {
                location.href = "/view/advancedSearch.html"
            })
            // 搜索
            $search.keypress(function (e) {
                var keycode = e.keyCode;
                var searchVal = $(this).val();
                var bwHistory = $.getKey('bwHistory');
                if (!bwHistory) {
                    bwHistory = [];
                } else {
                    bwHistory = JSON.parse($.getKey('bwHistory'));
                }
                if (keycode == '13') {
                    e.preventDefault();
                    bwHistory.unshift(searchVal);
                    $.setKey('bwHistory', JSON.stringify(bwHistory));
                    location.href = "/view/bookList.html?type=1&searchVal=" + searchVal;
                }
            });
            // 历史搜索
            var historyHtml = '';
            var historyData = JSON.parse($.getKey('bwHistory')) || [];
            historyData.forEach(function (el, index) {
                if (index < 3) {
                    historyHtml += '<p><a class="black-5" href="/view/bookList.html?type=1&searchVal=' + el + '">' + el + '</a></p>';
                }
            });
            $history.html(historyHtml);
            // 扫一扫
            $.getData({
                type: 'post',
                url: '/auth/wx_config?url='+location.href,
                success: function (data) {
                    callBack(data.data)
                }
            })
            function callBack(data) {
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
                                var resultStr=res.resultStr||'';
                                var resultIndex=resultStr.indexOf(',');
                                resultStr=resultStr.substring(resultIndex+1,resultStr.length);
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
        })
    });
});