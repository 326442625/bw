/**
 * Created by luoyilin
 */

//config info
//必须加上后缀.js，打包时用到，打包后自动去掉后缀
require.config({
    paths: {
        jquery: "/libs/jquery/dist/jquery.js",
        layer: "/libs/layer/dist/layer.js",
        date:"/libs/date/date.js",
        swiper: "/libs/swiper/dist/js/swiper.js",
        entry: "/script/entry.js",
        common: "/script/common.js",
        qrcode:"/libs/qrcode/qrcode.js",
        clip:"/libs/clip/clipboard.js" 
    },
    shim:{
        common:['jquery','layer'],
        date:['jquery'],
        qrcode:['jquery'],
        clip:['jquery'],
        lazyload:['jquery']
    }
});

//CONST
define(function () {
    return {
        BaseApiUrl: "#BaseApiUrl#", //不能修改字符串，地址需到gulp.config.js里配置
        BaseUrl: "#BaseUrl#",
        BaseAppId:"#BaseAppId#",
        BaseImg:"#BaseImg#",
        BaseBookImg:"#BaseBookImg#",
        LoginUrl:"#BaseLoginUrl#"
    };
});