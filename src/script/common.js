/**
 * Created by luoyilin
 */

//module

define(["entry", "clip"], function (CONST, Clipboard) {
    $.extend({
        getKey: function (key) { //获取本地存储数据
            return localStorage.getItem(key);
        },
        setKey: function (key, val) { //设置本地存储
            return localStorage.setItem(key, val);
        },
        getParam: function (param, url) { //获取url参数
            var reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (url) {
                r = url.substr(1).match(reg);
            }
            if (r != null) {
                return unescape(r[2]);
            } else {
                return null;
            }
        },
        copyText: function (id, msg) { //复制文本
            var clipboard = new Clipboard(id);
            clipboard.on('success', function (e) {
                layer.msg(msg);
                e.clearSelection();
            });
        },
        getData: function (config) { //ajax请求
            $.ajax({
                type: config.type ? config.type : 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('bwToken')
                },
                url: CONST.BaseApiUrl + config.url,
                data: config.param ? config.param : {},
                beforeSend: function () {
                    if (config.beforeLoading) {
                        layer.load();
                        if (config.beforeLoading.el) {
                            config.beforeLoading.el.hide();
                        }
                    }
                    if (config.beforeGetLoading) {
                        $.getLoading();
                    }
                    config.before ? config.before() : null;
                },
                success: function (data) {
                    if (config.beforeLoading) {
                        layer.closeAll('loading');
                        if (config.beforeLoading.el) {
                            config.beforeLoading.el.fadeIn();
                        }
                    }
                    if (config.beforeGetLoading) {
                        var $loading = $("#JS_w_loading");
                        $loading.hide();
                    }
                    if (data.code == 401) {
                        wxAuth();
                        return false;
                    }
                    if (data.code == 403&&!config.isShare) {
                        layer.msg(data.msg, {
                            time: 2000
                        }, function () {
                            location.href = '/view/login.html';
                        });
                        return false;
                    }
                    if (data.code !== 200 && data.code !== 201) {
                        layer.msg(data.msg);
                        return false;
                    }
                    config.success(data);
                    // 图片
                    $("img").each(function () {
                        $(this).addClass('fadeIn').removeClass('opacity-0');
                        $(this).error(function () {
                            this.src = CONST.BaseBookImg + "/noimages.jpg_350x350";
                            $(this).unbind('error');
                        })
                    })
                },
                complete: function () {
                    config.complete ? config.complete() : null;
                },
                error: function (data) {
                    var data = JSON.parse(data.responseText);
                    if (data.code == 400) {
                        layer.msg(data.msg);
                        return false;
                    }
                    if (data.code == 403&&!config.isShare) {
                        layer.msg(data.msg, {
                            time: 2000
                        }, function () {
                            location.href = '/view/login.html';
                        });
                        return false;
                    }
                    config.errors ? config.errors() : null;
                }
            });
        },
        pop: function (param) {
            var $mask = $('.w-mask');
            var $el = param.el;
            var $body=$('body');
            var wScrollTop=$(window).scrollTop()||0;
            $body.data('top',wScrollTop);
            if ($mask.length < 1) {
                var maskHtml = '<div class="w-mask"></div>';
                $body.append(maskHtml);
                var $mask = $('.w-mask');
                var oTop = param.top || '100%';
                $(".close", $el).click(function () {
                    $mask.fadeOut(function () {
                        if (param.callBack) {
                            param.callBack();
                        }
                    });
                    $($el).css({
                        "top": oTop
                    });
                    $body.css({
                        'position': 'static',
                        'width': 'auto',
                        'height': 'auto'
                    });
                    $(window).scrollTop(parseFloat($body.data('top')));
                })
                if (param.clickMaskClose) {
                    $mask.click(function () {
                        $mask.fadeOut(function () {
                            if (param.callBack) {
                                param.callBack();
                            }
                        });
                        $($el).css({
                            "top": oTop
                        });
                        $body.css({
                            'position': 'static',
                            'width': 'auto',
                            'height': 'auto'
                        });
                        $(window).scrollTop(parseFloat($body.data('top')));
                    })
                }
            }
            $mask.show();
            if (param.forbidScroll) {
                $body.css({
                    'position': 'fixed',
                    'width': '100%',
                    'height': '100%',
                    'top':-wScrollTop+'px'
                });
            }
            var mTop = ($(window).height() - $el.height()) / 2;
            $el.css({
                "top": mTop
            });
        },
        isLogin: function () {
            var token = localStorage.getItem('bwToken');
            var expiresTime = localStorage.getItem('bwExpires');
            var curUrl = location.href;
            var curTime = new Date().getTime();
            // 找不到token授权
            if (!token || token == 'undefined') {
                wxAuth();
                // else if (curTime < parseInt(expiresTime)) {
                //     // token没过期则判断登录状态
                //     $.ajax({
                //         type: 'post',
                //         url: CONST.BaseUrl+'/auth/check_auth',
                //         headers: {
                //             'Authorization': 'Bearer ' + localStorage.getItem('bwToken')
                //         },
                //         data:{},
                //         success: function (data) {
                //             if (data.code !== 200) {
                //                 wxAuth();
                //             }
                //             console.log("登录ok",data);
                //         }
                //     })
                // }
            } else if (curTime >= parseInt(expiresTime)) {
                // token过期刷新token
                $.ajax({
                    type: 'post',
                    url: CONST.BaseApiUrl + '/auth/refresh',
                    async: false,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('bwToken')
                    },
                    success: function (data) {
                        if (data.code !== 200) {
                            wxAuth();
                            return false;
                        }
                        console.log("刷新ok", data);
                        var token = data.data.token;
                        var expiresTime = new Date().getTime() + data.data.expires_in * 1000;
                        localStorage.setItem('bwToken', token);
                        localStorage.setItem('bwExpires', expiresTime);
                    }
                })
            }
        },
        getPrice: function (price) {
            var price = parseFloat(price).toFixed(2);
            var priceIndex = price.indexOf('.');
            var qPrice = price.substring(0, priceIndex);
            var hPrice = price.substring(priceIndex, priceIndex + 3);
            return {
                qPrice: qPrice,
                hPrice: hPrice
            }
        },
        getTime: function (time) {
            return time.substring(0, 10).replace(/-/g, '/');
        },
        loadMore: function (data, url, callBack, type, invoicesType) {
            var $loadingMore = $("#JS_loading_more");
            var loadingStart;
            loadMore(data);

            function loadMore(data) {
                var pageInfo = data;
                if (!data.last_page) {
                    pageInfo = data.data;
                }
                if (data.topic_info) {
                    pageInfo = data.topic_info;
                }
                if (data.order_item) {
                    pageInfo = data.order_item;
                }
                if (data.invoice) {
                    pageInfo = data.invoice;
                }
                if (data.standard) {
                    switch (invoicesType) {
                        case 0:
                            pageInfo = data.standard;
                            break;
                        case 1:
                            pageInfo = data.non_standard;
                            break;
                        case 2:
                            pageInfo = data.return_diff;
                            break;
                        case 3:
                            pageInfo = data.return_back;
                            break;
                    }
                }
                var $loading = $(".JS_loading", $loadingMore);
                var $loaded = $(".JS_loaded", $loadingMore);
                $loadingMore.show();
                if (pageInfo.current_page == pageInfo.last_page) {
                    if (type == 'click' || pageInfo.current_page == 1) {
                        $loadingMore.hide();
                    } else {
                        $loaded.show().prev().hide();
                    }
                    return false;
                }
                loadingStart = true;
                $loadingMore.data('next', parseInt(pageInfo.current_page) + 1);
            }
            if (type == 'click') {
                var $loading = $(".JS_loading", $loadingMore);
                $loading.prev().hide();
                $loading.click(function () {
                    if (loadingStart) {
                        var nextPage = $loadingMore.data('next');
                        loadingStart = false;
                        $.getData({
                            type: 'get',
                            before: function () {
                                $loading.hide().prev().show();
                            },
                            url: '/' + url + '?page=' + nextPage,
                            success: function (data) {
                                callBack(data);
                                $loading.show().prev().hide();
                                loadMore(data.data);
                            },
                            error: function () {
                                $loading.show().prev().hide();
                            }
                        })
                    }
                })
                return false;
            }
            $(window).scroll(function () {
                var oHeight = $(window).scrollTop() + $(window).height() + 50;
                var oTop = $loadingMore.offset().top;
                if (oHeight >= oTop && loadingStart) {
                    var nextPage = $loadingMore.data('next');
                    var mNextUrl = '/' + url + '?page=' + nextPage;
                    if (url.indexOf('?') !== -1) {
                        mNextUrl = '/' + url + '&page=' + nextPage;
                    }
                    loadingStart = false;
                    $.getData({
                        type: 'get',
                        url: mNextUrl,
                        success: function (data) {
                            callBack(data);
                            loadMore(data.data);
                        }
                    })
                }
            })
        },
        tab: function (param) {
            var $el = param.el;
            var aIndex = param.index || 0;
            var funs = param.funs || [];
            $el.find('a').eq(aIndex).addClass('active');
            $el.on('click', 'a', function () {
                var pIndex = $(this).parent().index();
                $el.find('a').removeClass('active');
                if (funs[pIndex]) {
                    funs[pIndex]();
                }
            })
        },
        getLoading: function () {
            var html = '<div id="JS_w_loading" class="w-loading">\
                        <i class="icon icon-loading2"></i>\
                        <p class="margin-top-15">加载中...</p>\
                    </div>'
            if ($("#JS_w_loading").length == 0) {
                $("body").append(html);
            }
            $("#JS_w_loading").show();
        },
        getAllLoading: function () {
            var html = '<div id="JS_w_all_loading" class="w-loading">\
                        <i class="icon icon-loading3"></i>\
                        <p class="margin-top-15">加载中...</p>\
                    </div>'
            if ($("#JS_w_all_loading").length == 0) {
                $("body").append(html);
            }
            $("#JS_w_all_loading").show();
        },
        unique: function (arr) {　　
            var res = [];　　
            var json = {};　　
            for (var i = 0; i < arr.length; i++) {　　　　
                if (!json[arr[i]]) {　　　　　　
                    res.push(arr[i]);　　　　　　
                    json[arr[i]] = 1;　　　　
                }　　
            }　　
            return res;
        },
        page: function myPage(param) {
            var data = param.data || {};
            var getData = param.fun;
            var par = param.par;
            var $page = $("#JS_page");
            $page.unbind('click');
            getPages(data.current_page);
            $page.on('click', '.first', function () {
                if (data.current_page == 1) {
                    layer.msg('已经是第一页了~');
                    return false;
                }
                getData(1, par);
                getPages(1);
            })
            $page.on('click', '.last', function () {
                if (data.current_page == data.last_page) {
                    layer.msg('已经是最后一页了~');
                    return false;
                }
                getData(data.last_page, par);
                getPages(data.last_page);
            })
            $page.on('click', '.previous', function () {
                if (data.current_page == 1) {
                    layer.msg('没有上一页了~');
                    return false;
                }
                getData(data.current_page - 1, par);
                getPages(data.current_page - 1);
            })
            $page.on('click', '.next', function () {
                if (data.current_page == data.last_page) {
                    layer.msg('没有下一页了~');
                    return false;
                }
                getData(data.current_page + 1, par);
                getPages(data.current_page + 1);
            })
            $page.on('click', '.page', function () {
                var page = parseInt($(this).attr('value'));
                if (data.current_page == page) {
                    return false;
                }
                getData(page, par);
                getPages(page);
            })

            function getShowPages(page, totalPages) {
                var showPages = [];
                if (totalPages <= 5) {
                    for (var i = 0; i < totalPages; i++) {
                        showPages[i] = i + 1;
                    }
                } else {
                    showPages.push(page);
                    var offset = 1;
                    while (showPages.length < 5) {
                        if (page - offset > 0) {
                            showPages.unshift(page - offset);
                        }
                        if (page + offset <= totalPages) {
                            showPages.push(page + offset);
                        }
                        offset++;
                    }
                }
                return showPages;
            }

            function getPages(page) {
                var html = '';
                $page.html('');
                var pages = getShowPages(page, data.last_page);
                html += '<li class="paginate_button" >\
                                <a href="javascript:;" class="first">首页</a>\
                    </li>\
                    <li class="paginate_button" >\
                        <a href="javascript:;" class="previous">上页</a>\
                     </li>'
                $.each(pages, function (index, el) {
                    var activeClass = el == page ? 'active' : '';
                    html += '<li class="paginate_button">\
                        <a href="javascript:;" class="page ' + activeClass + '" value="' + el + '">' + el + '</a>\
                    </li>'
                })
                html += '<li class="paginate_button" >\
                        <a href="javascript:;" class="next">下页</a>\
                    </li>\
                        <a href="javascript:;" class="last">末页</a>\
                    </li>'
                $page.html(html);
            }
        },
        timeStamp: function (time) {
            var date = new Date(time);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
        },
        share: function (param) {
            var $body = $('body');
            var oTop=$(window).scrollTop()||0; 
            var html = '<div id="JS_share_mask" class="w-mask share-mask disn">\
                        <div class="share-info white">\
                            <p>1.点击右上角；</p>\
                            <p>2.发送给朋友或分享到朋友圈</p>\
                        </div>\
                        <i class="icon icon-share"></i>\
                    </div>'
            if(param.type=='check'){
                html = '<div id="JS_share_mask" class="w-mask share-mask disn">\
                        <div class="share-info white">\
                            <p>1.点击右上角；</p>\
                            <p>2.在浏览器中打开</p>\
                        </div>\
                        <i class="icon icon-share"></i>\
                    </div>'
            }
            $body.data('top',oTop);
            if ($("#JS_share_mask").length == 0) {
                $body.append(html);
                $("#JS_share_mask").click(function () { 
                    $(this).fadeOut(); 
                    $body.css({
                        'position': 'static',
                        'width': 'auto',
                        'height': 'auto'
                    });
                    $(window).scrollTop(parseFloat($body.data('top')));
                })
            }  
            $body.css({
                'position': 'fixed',
                'width': '100%',
                'height': '100%',
                'top':-oTop+'px'
            }); 
            $("#JS_share_mask").fadeIn();
        },
        getImg:function(imgUrl){  
            if(imgUrl.indexOf('/uploads/')==0){
                var imgStr=String(imgUrl).replace(/\/uploads\//g,function(){return CONST.BaseImg+'/'});
                return imgStr;
            }
            var imgStr=String(imgUrl).replace(/"\/uploads\//g,function(){return '"'+CONST.BaseImg+'/'});
            var imgStr2=String(imgStr).replace(/'\/uploads\//g,function(){return "'"+CONST.BaseImg+'/'});
            return imgStr2;
        },
        refresh:function(){
            //微信后退强制刷新
            var isPageHide = false; 
            window.addEventListener('pageshow', function () { 
              if (isPageHide) { 
                window.location.reload(); 
              } 
            }); 
            window.addEventListener('pagehide', function () { 
              isPageHide = true; 
            }); 
        }
    }) 
    // 微信授权
    function wxAuth() {
        var wxUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + CONST.BaseAppId + '&redirect_uri=' + CONST.BaseUrl + '/view/loginCallBack.html' + '&response_type=code&scope=snsapi_userinfo&state=b017886320c8628f14e7d9367bfdeea6&connect_redirect=1#wechat_redirect';
        $.setKey('bwUrl', location.href);
        location.href = wxUrl;
    }

    function accAdd(arg1, arg2) {
        var r1, r2, m;
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    }
    //给Number类型增加一个add方法，调用起来更加方便。 
    Number.prototype.add = function (arg) {
        return accAdd(arg, this);
    }

    function accMul(arg1, arg2) {
        var m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length
        } catch (e) {}
        try {
            m += s2.split(".")[1].length
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }
    //给Number类型增加一个mul方法，调用起来更加方便。 
    Number.prototype.mul = function (arg) {
        return accMul(arg, this);
    }

    return $;
});