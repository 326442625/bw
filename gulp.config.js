/**
 *  
 */
module.exports = function(){
    var path = {
                    dist : "./dist",
                    test : "./test",
                    dev : "./dev",
                    src : "./src",
                    rev : "./rev",
                    css : "/css",
                    script : "/script",
                    images : "/images",
                    libs : "/libs"
                };

    var config = {
        path : path,
        BaseApiUrlDist : "https://bwst.weilaba.com.cn/api/v1", //生产环境api地址
        BaseApiUrlTest : "https://bwst.weilaba.com.cn/api/v1", //测试环境api地址 
        BaseApiUrlDev : "https://bwst.weilaba.com.cn/api/v1", //本地环境api地址
        BaseUrlDist : "http://bwst.weilaba.com.cn", //生产环境地址
        BaseUrlTest : "http://bwst.weilaba.com.cn", //测试环境地址
        BaseUrlDev : "http://192.168.2.168:8001", //本地环境地址 
        BaseAppIdDist : "wx51539ccd5cb8ea1f", //生产环境地址
        BaseAppIdTest : "wx51539ccd5cb8ea1f", //测试环境地址 
        BaseAppIdDev : "wx5ef64539b2dd8056", //本地环境地址 
        BaseImgDist : "https://bwst-cdn1.weilaba.com.cn", //生产环境图片地址
        BaseImgTest : "https://bwst-cdn1.weilaba.com.cn", //测试环境地址 
        BaseImgDev : "https://bwst-cdn1.weilaba.com.cn", //本地环境图片地址
        BaseBookImgDist:"https://bwst-cdn2.weilaba.com.cn/netbook/Bookimages",
        BaseBookImgTest:"https://bwst-cdn2.weilaba.com.cn/netbook/Bookimages",
        BaseBookImgDev:"https://bwst-cdn2.weilaba.com.cn/netbook/Bookimages",
        BaseLoginUrlDist:"/auth/login_wx",
        BaseLoginUrlTest:"/auth/login_wx",
        BaseLoginUrlDev:"/auth/login_wx_mock",
        src : {
            img : path.src + path.images + "/**/*.*",
            css : [
                path.src + path.css + "/public.css",
                path.src + path.css + "/main.css",
                path.src+path.libs+"/layer/dist/theme/default/layer.css",
                path.src+path.libs+"/swiper/dist/css/swiper.css",
                path.src+path.libs+"/date/date.min.css",
                path.src+path.libs+"/pdf/jquery.touchPDF.css",
                path.src+path.libs+"/mescroll/mescroll.min.css",
            ],
            script : [
                path.src + path.script + "/**/*.js"
            ]
        },
        copyfile : [
            path.src + path.libs + "/**/*min.js"
        ]
    };

    return config;
};