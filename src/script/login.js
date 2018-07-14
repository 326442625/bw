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
            var flag=true;
            $input.focus(function () {
                $(this).parent().addClass('act');
            })
            $input.blur(function () {
                if (!$(this).val()) {
                    $(this).parent().removeClass('act');
                }
                if ($inputAccount.val() && $inputPwd.val()) {
                    $login.addClass('act');
                } else {
                    $login.removeClass('act');
                }
            })
            $login.click(function () {
                var username = $inputAccount.val();
                var password = $inputPwd.val();
                if (!username) {
                    layer.msg('请输入账号！');
                    return false;
                }
                if (!password) {
                    layer.msg('请输入密码！');
                    return false;
                }
                if(flag){
                    flag=false;
                    $.getData({
                        type: 'post',
                        url: '/bind/bind_master',
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
                            flag=true;
                        },
                        error:function(){
                            flag=true;
                        }
                    })
                }
            })
        })
    });
});