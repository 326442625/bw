/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common","qrcode"], function ($) {
        $(function () {
            var $add = $("#JS_add");
            var $pop = $("#JS_pop");
            var $code = $("#JS_code");
            var $masterName=$("#JS_master_name");
            var $shopName=$("#JS_shop_name");
            var $userImg=$("#JS_user_img");
            var $binded=$("#JS_binded");
            var $totalBind=$("#JS_total_bind");
            var $list=$("#JS_sub_list");
            // 请求获得账号详情
            $.isLogin();
            getCode();
            $.getData({
                type: 'get',
                url: '/bind',
                success: function (data) {
                   if(data.data.length==0){
                       layer.msg(data.msg);
                   }
                   $masterName.html(data.data.master_info.name);
                   $shopName.html(data.data.bookshop_info.Wkers_Name);
                   $binded.html(data.data.associate_account.length);
                   $totalBind.html(data.data.bind_num);
                   $userImg.attr("src",data.data.master_info.profile.avatar);
                   callBack(data.data.associate_account);
                }
            })
            function callBack(data){
                var html='';
                $.each(data, function (index, el) {
                    html += '<div class="border-bottom account-info bg-white">\
                                <a href="javascript:;" class="img-warpper">\
                                    <img src="'+el.profile.avatar+'">\
                                    <span class="margin-left-5">'+el.name+'</span>\
                                </a>\
                                <a href="javascript:;" class="delete f-right red JS_del" data-id="'+el.id+'">解绑</a>\
                            </div>'
                })
                $list.html(html);
            }
            // 生成二维码
            function getCode(){
                $.getData({
                    url: '/bind/generate_code',
                    success: function (data) {
                       var qr_code=data.data.qr_code;
                       if(!qr_code){
                         $add.addClass('opacity-6').data('add',false);
                         return false;
                       }
                       $add.addClass('fadeIn').data('add',true);
                       $code.empty();
                       new QRCode($code.get(0), {
                        text: CONST.BaseUrl+'/view/bindCallBack.html?qrCode='+qr_code,
                        width: 200,
                        height: 200,
                        colorDark: "#000000",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.M
                    });
                    }
                })
            }
            // 添加子账号
            $add.click(function () {
                if(!$(this).data('add')){
                    layer.msg('您的子账号绑定已全部绑定完成');
                    return false;
                }
                $.pop({el:$pop,top:'120%',callBack:function(){
                    location.href="/view/account.html";
                }});
            })
            // 删除子账号
            $list.on('click','.JS_del',function(){
                var _this=$(this);
                var id=_this.data('id');
                layer.confirm('确定解绑该账户？', {
                    btn: ['确定','取消'] //按钮
                  }, function(){
                    $.getData({
                        type:'post',
                        url:'/bind/unbind_sub_account',
                        param:{
                           sub_user_id:id
                        },
                        success:function(data){
                           layer.msg(data.msg); 
                           getCode();
                           _this.parents('.account-info').hide();
                           $binded.html(parseInt($binded.html())-1);
                        }
                    })
                  }) 
            })
        })
    });
});