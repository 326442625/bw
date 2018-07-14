/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common","swiper"], function ($,Swiper) {
       $(function(){
        var $userName = $("#JS_user_name");
        var $userImg=$("#JS_user_img");
        var $shopName = $("#JS_shop_name");
        var $attention = $("#JS_attention");
        var $growth = $("#JS_growth");
        var $tracks = $("#JS_tracks");
        var $book = $("#JS_book");
        var $orderAllNum = $("#JS_order_all_num");
        var $ordernoSubmitNum = $("#JS_order_no_submit_num");
        var $orderSubmitNum = $("#JS_order_submit_num");
        var $orderAllocatedNum= $("#JS_order_allocated_num");
        var $invoiceAll = $("#JS_invoice_all");
        var $invoiceSale = $("#JS_invoice_sale");
        var $invoiceSaleReturn = $("#JS_invoice_sale_return");
        var $isShow = $("input[name=is_show_discount]");
        var $isMaster = $("#JS_is_master");
        var $pop=$("#JS_pop");
        var $submit=$("#JS_submit");
        var $inputAccount=$("#JS_account");
        var $inputPwd=$("#JS_pwd");
        var $circle=$(".icon-circle");
        var $grade=$("#JS_grade");
        var $orderLink=$(".JS_order_link");
        var $orderAllLink=$(".JS_order_all_link");
        var $invoiceLink=$(".JS_invoice_link");
        var $invoiceAllLink=$(".JS_invoice_all_link");
        var isSubmit=true;
        var growthData={}; 
        // 请求获得用户信息
        $.isLogin();
        $.getData({
            type: 'get',
            url: '/me',
            success: function (data) {
                $userName.html(data.data.user_info.name);
                $shopName.html(data.data.bookshop_info.Wkers_Name);
                $attention.html(data.data.attention_num);
                $growth.html(data.data.profile.growth_value);
                $grade.css({'background':'url('+$.getImg(data.data.my_level.rank_image_path)+')','background-size':'100% 100%'});
                $grade.fadeIn();
                $tracks.html(data.data.tracks_num);
                $orderAllNum.html(data.data.order_all_num);
                $ordernoSubmitNum.html(data.data.order_no_submit_num);
                $orderSubmitNum.html(data.data.order_submit_num);
                $orderAllocatedNum.html(data.data.order_allocated_num);
                $invoiceAll.html(data.data.invoice_all);
                $invoiceSale.html(data.data.invoice_sale);
                $invoiceSaleReturn.html(data.data.invoice_sale_return);
                $isShow.prop('checked',data.data.profile.is_show_discount);
                $userImg.attr("src",data.data.profile.avatar);
                data.data.user_info.is_master ? $isMaster.fadeIn() : $isMaster.fadeOut();
                growthData.rankName=data.data.my_level.rank_name;
                growthData.value=data.data.profile.growth_value;
                growthData.rank=data.data.my_level.rank_name.replace(/[^0-9]/ig,"");
                growthData.userImg=data.data.profile.avatar;
                $.setKey('bwGrowthData',JSON.stringify(growthData));
                $circle.each(function(){
                    if(parseInt($(this).html())>0){
                        $(this).show();
                    }
                    if(parseInt($(this).html())>99){
                        $(this).addClass('more').html('99+');
                    }
                }) 
            }
        })
        // 获取我的书单
        $.getData({
            type: 'get',
            url: '/book_list_share',
            success: function (data) { 
                $book.html(data.data.length);
            }
        })
        //是否显示折扣
        $isShow.change(function () {
            var status = $(this).prop('checked');
            $(this).prop('checked',!status);
            $inputAccount.val('');
            $inputPwd.val('');
            $.pop({
                el: $pop
            });
            isSubmit=true;
        })
        // 跳转到订单列表
        $orderLink.click(function(){
            var index=$(this).index();
            $.setKey('bwOrderStatus',index);
            location.href="/view/order.html";
        })
        $orderAllLink.click(function(){
            $.setKey('bwOrderStatus',0);
            location.href="/view/order.html";
        })
        // 跳转到单据列表
        $invoiceLink.click(function(){
            var index=$(this).index();
            $.setKey('bwInvoiceStatus',index);
            location.href="/view/invoices.html";
        })
        $invoiceAllLink.click(function(){
            $.setKey('bwInvoiceStatus',0);
            location.href="/view/invoices.html";
        })
        // 显示折扣提交
        $submit.click(function(){
            if(!isSubmit){
                return false;
            }
            var password = $inputPwd.val();
            if(!password){
                layer.msg('请输入密码!');
                return false;
            }
            var status = $isShow.prop('checked');
            var flag = status ? 0 : 1;
            isSubmit=false;
            $.getData({
                type: 'put',
                url: '/me/discount',
                param: {
                    password: password,
                    flag: flag
                },
                success: function (data) {
                    layer.msg(data.msg,{time:2000},function(){
                        if(data.data.value){
                            $isShow.prop('checked',!status); 
                            $.setKey('bwDiscount', flag);
                            $pop.find('.close').trigger('click');
                        }
                        isSubmit=true;
                        
                    });
                },
                error:function(){
                    isSubmit=true;
                }
            })
        })
       })
    });
});