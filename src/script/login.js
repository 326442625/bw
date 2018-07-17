/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $input = $(".JS_input");
            var $inputAccount = $("#JS_account");
            var $inputPwd = $("#JS_pwd");
            var $login = $("#JS_login");
            var $aggreeServe=$("#JS_aggree_serve");
            var $aggreeSecrecy=$("#JS_aggree_secrecy");
            var flag=true;
            $input.focus(function () {
                $(this).parent().addClass('act');
            })
            $input.blur(function () { 
                if (!$(this).val()) {
                    $(this).parent().removeClass('act');
                }
                check();
            })
            $aggreeServe.change(function(){
                check();
            })
            $aggreeSecrecy.change(function(){
                check();
            })
            function check(){
                var username = $inputAccount.val();
                var password = $inputPwd.val();
                var aggreeServeChecked=$aggreeServe.prop('checked');
                var aggreeSecrecyChecked=$aggreeSecrecy.prop('checked');
                if (username && password&&aggreeServeChecked&&aggreeSecrecyChecked) {
                    $login.addClass('act');
                } else {
                    $login.removeClass('act');
                }
            }
            $login.click(function () {
                var username = $inputAccount.val();
                var password = $inputPwd.val();
                var aggreeServeChecked=$aggreeServe.prop('checked');
                var aggreeSecrecyChecked=$aggreeSecrecy.prop('checked');
                if (!username) {
                    layer.msg('请输入账号！');
                    return false;
                }
                if (!password) {
                    layer.msg('请输入密码！');
                    return false;
                }
                if(!aggreeServeChecked){
                    layer.msg('需要同意三通服务协议！');
                    return false; 
                }
                if(!aggreeSecrecyChecked){
                    layer.msg('需要同意三通保密协议！');
                    return false; 
                }
                if(flag){
                    flag=false;
                    $.getData({
                        type: 'post',
                        url: '/bind/bind_master',
                        isShare:true,
                        param: {
                            username: username,
                            password: password
                        },
                        success: function (data) { 
                            layer.msg(data.msg,{time:2000},function(){
                                if(data.data.success){
                                    location.href='/view/user.html';
                                }
                            }); 
                        },
                        complete:function(){ 
                            flag=true;
                        }
                    })
                }
            })
        })
    });
});