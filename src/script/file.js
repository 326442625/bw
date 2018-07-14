/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var fileUrl = 'http://123.207.227.113:88/netbook/upfiles/'+$.getParam('file');
            if(fileUrl.indexOf('https://bwst-cdn1.weilaba.com.cn')!==-1){
                fileUrl=$.getParam('file');
            }
            var $check = $("#JS_check");
            //判断是否是微信浏览器的函数
            function isWeiXin() {
                //window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
                var ua = window.navigator.userAgent.toLowerCase();
                //通过正则表达式匹配ua中是否含有MicroMessenger字符串
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                    return true;
                } else {
                    return false;
                }
            }
            $check.click(function () {
               if(isWeiXin()){
                   $.share({type:'check'});
               }else{ 
                   location.href=fileUrl;
               }
            }) 
        })
    });
});