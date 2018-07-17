  /**
   * Created by luoyilin
   */
  require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var urlCode=$.getParam('qrCode');
            $.isLogin();
            $.getData({//请求绑定子账号
                type: 'post',
                url: '/bind/bind_sub_account',
                param:{qr_code:urlCode},
                success: function (data) {
                   layer.msg(data.msg,{time:2000},function(){
                       location.href="/";
                   });
                },error:function(data){
                    layer.msg(data)
                }
            })
        })
    });
});