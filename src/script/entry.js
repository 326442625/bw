/**
 * Created by luoyilin
 */

//config info
//必须加上后缀.js，打包时用到，打包后自动去掉后缀(打包的js必须有两个一个是min.js一个是.js)
require.config({
    paths: {
        jquery: "/libs/jquery/dist/jquery.js",
        layer: "/libs/layer/dist/layer.js",
        date:"/libs/date/date.js",
        swiper: "/libs/swiper/dist/js/swiper.js",
        entry: "/script/entry.js",
        common: "/script/common.js",
        qrcode:"/libs/qrcode/qrcode.js",
        clip:"/libs/clip/clipboard.js",
        mescroll:"/libs/mescroll/mescroll.js"
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
    return {//配置基础的信息(本地和生产区别的配置)
        BaseApiUrl: "#BaseApiUrl#", //不能修改字符串，地址需到gulp.config.js里配置
        BaseUrl: "#BaseUrl#",
        BaseAppId:"#BaseAppId#",
        BaseImg:"#BaseImg#",
        BaseBookImg:"#BaseBookImg#",
        LoginUrl:"#BaseLoginUrl#"
    };
});