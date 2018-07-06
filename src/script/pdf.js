$(function () {
    function getParam(param, url) { //获取url参数
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
    }
    var source = getParam('pdf');
    var $pdf = $("#myPDF");
    $pdf.pdf({
        source: '/images/demo.pdf'
    });
    $('.pdf-toolbar').hide();
})