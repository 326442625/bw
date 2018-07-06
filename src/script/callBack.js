  /**
   * Created by luoyilin
   */
  require(["entry"], function (CONST) {
      require(["common"], function ($) {
          $(function () {
              var wxCode = $.getParam('code');
              var bwUrl = $.getKey('bwUrl')||'/'; 
              if(bwUrl.indexOf('loginCallBack.html')!==-1){
                bwUrl="/";
              }
              $.getData({
                  url:CONST.LoginUrl,
                  param: {
                      code: wxCode
                  },
                  success: function (data) {
                      if(data.code==200){
                        var token = data.data.token;
                        var expiresTime = new Date().getTime() + data.data.expires_in * 1000;
                        $.setKey('bwToken', token);
                        $.setKey('bwExpires', expiresTime);
                        location.href=bwUrl;
                      }else{
                        layer.msg(data.msg);
                        location.href='/view/login.html';
                      }
                  },
                  error:function(data){
                    layer.msg(data.msg);
                    location.href='/view/login.html';
                  }
              })
          })
      });
  });