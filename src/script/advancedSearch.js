/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "date"], function ($) {
        $(function () {
            var Accordion = function (el, multiple, link) {
                this.el = el || {};
                this.multiple = multiple || false;
                // Variables privadas
                // var links = this.el.find(link);
                // Evento
                this.el.on('click',link,{
                    el: this.el,
                    multiple: this.multiple
                }, this.dropdown)
            };
            Accordion.prototype.dropdown = function (e) {
                var $el = e.data.el;
                $this = $(this);
                $next = $this.next();
                $text = $this.find('.text');
                $i = $this.find('i.icon-down');
                $i2 = $this.find('i.icon-open2');
                $next.slideToggle();
                $this.parent().toggleClass('open');
                $i.toggleClass('icon-top');
                $this.parent().siblings().find('.icon-close2').removeClass('icon-close2');
                $i2.toggleClass('icon-close2');
                $text.html() == '展开' ? $text.html('收起') : $text.html('展开');
                if (!e.data.multiple) {
                    $el.children('.submenu').not($next).slideUp().parent().removeClass('open');
                }
            };
            var accordion = new Accordion($('#JS_search'), false, '.JS_status');
            var $start = $("#JS_start_time");
            var $end = $("#JS_end_time");
            var $minPrice = $("input[name=JS_min_price]");
            var $maxPrice = $("input[name=JS_max_price]");
            var $price = $(".JS_price");
            var $loading=$("#JS_loading_more");
            var $loading2=$(".JS_loading_more2");
            var $list=$("#JS_list");
            var $reset=$("#JS_reset");
            var $searchWarpper=$("#JS_search_warpper");
            var $sStatus=$("#JS_s_status");
            var $sType=$("#JS_s_type");
            var param = {};
            function callBack(data){
                var html='';
                $.each(data,function(index,el){
                    var children=el.children?el.children:[];
                    var isShow=children.length==0?'disn':'';
                    html+='<li class="type gray bg-white border-bottom '+isShow+'">\
                                <div class="type-name gray JS_link">\
                                    <span>'+el.Gtype_Name+'</span>\
                                    <a href="javascript:;" class="f-right">\
                                        <i class="icon icon-open2"></i>\
                                    </a>\
                                </div>\
                                <div class="submenu border-top">\
                                    <div class="a-content">'
                    $.each(children,function(index2,el2){
                         html+='<a href="javascript:;" fCode="'+el2.Gtype_Code+'" class="margin-right-10 margin-bottom-10 JS_check_cate">'+el2.Gtype_Name+'\
                                    <i class="icon"></i>\
                                </a>'
                    })
                    html+= '</div>\
                                </div>\
                            </li>'
                })
                $list.html(html);
                new Accordion($('#JS_category'), false, '.JS_status');
                new Accordion($('.type'), false, '.JS_link');
            }
            // 获取分类信息
            $.getData({
                type:'get',
                before:function(){
                    $loading.show();
                },
                url:'/book_class',
                success:function(data){
                    $loading.hide();
                    callBack(data.data.bw.children);
                }
            })
            // 获取类型
            $.getData({
                type:'get',
                before:function(){
                    $loading2.show();
                },
                url:'/config/book_config/types',
                success:function(data){
                    $loading2.hide();
                    callBackType(data.data.type01,1,$sStatus);
                    callBackType(data.data.type04,2,$sType);
                }
            })
            function callBackType(data,type,dom){
                var html='';
                var typeClass=type==1?'JS_h_type01':'JS_h_type04';
                $.each(data,function(index,el){
                    var isShow=index<3?'':'disn';
                    html+='<a href="javascript:;" class="'+isShow+' margin-top-10 margin-right-10  JS_checked"><span class="'+typeClass+'" value="'+el.fCode+'">'+el.fName+'</span>\
                            <i class="icon"></i>\
                       </a>'
                })
                html+='<a href="javascript:;" class="more margin-top-10 margin-right-10"><span>更多</span>\
                         <i class="icon icon-more"></i>\
                       </a>'
                dom.html(html);
            }
            // 更多
            $searchWarpper.on('click','.more',function(){
                var status=$(this).data('more');
                if(!status){
                    $(this).children('span').html('收起');
                    $(this).data('more',true).siblings().css("display","inline-block");
                }else{
                    $(this).children('span').html('更多');
                    $(this).data('more',false).siblings('a:gt(2)').css("display","none");
                }
            })
            // 选择
            $searchWarpper.on('click','.JS_checked_mul',function () {
                $(this).toggleClass('active');
            })
            $searchWarpper.on('click','.JS_checked',function () {
                $(this).siblings().removeClass('active');
                $(this).toggleClass('active');
            })

            $list.on('click','.JS_check_cate',function(){
                if($(this).attr('class').indexOf('active')!==-1){
                    $(this).removeClass('active');
                }else{
                    $list.find('a').removeClass('active');
                    $(this).addClass('active');
                }
                $list.find('a').each(function(){
                    if($(this).attr('class').indexOf('active')!==-1){
                        param.H_type=$(this).attr('fCode');
                    }
                })
            })
            // 日期
            $start.mobiscroll().date({
                theme: "ios",
                mode: "scroller",
                display: "bottom",
                lang: "zh",
                maxDate: new Date(2050, 7, 30, 15, 44),
            });
            $end.mobiscroll().date({
                theme: "ios",
                mode: "scroller",
                display: "bottom",
                lang: "zh",
                maxDate: new Date(2050, 7, 30, 15, 44),
            });
            // 价格限制
            $price.change(function () {
                var val = $(this).val();
                if (!/^[0-9\.]*$/.test(val)) {
                    layer.msg('请输入正确的价格~');
                    $(this).val('');
                } else if (parseFloat(val) < 0.01) {
                    layer.msg('请输入大于0.01的价格~');
                    $(this).val('');
                } else if (!/^[0-9]*[1-9][0-9]*$/.test('' + parseFloat(val).mul(100))) {
                    layer.msg('请输入正确的价格~');
                    $(this).val('');
                }
            })
            // 重置
            $reset.click(function(){
                param={};
                $searchWarpper.find('.a-content a').removeClass('active');
                $searchWarpper.find('input').val('');
            })
            // 搜索  
            var $H_name = $("#JS_H_name"); //书名
            var $H_isbn = $("#JS_H_isbn"); //国际码
            var $h_barcode = $("#JS_h_barcode"); //条码
            var $H_writer = $("#JS_H_writer"); //作者
            var $h_publish = $("#JS_h_publish"); //出版社
            var $H_serial_book = $("#JS_H_serial_book"); //丛书名
            var $H_newbook = $("#JS_H_newbook"); //首次到货
            var $H_qty_zero = $("#JS_H_qty_zero"); //库存图书
            var $H_Typename = $("#JS_H_Typename"); //图书分类
            var $submit = $("#JS_submit");
            $submit.click(function () {
                var $h_type0 = $(".JS_h_type01"); //状态
                var $h_type04 = $(".JS_h_type04"); //类型
                if ($.trim($H_name.val())) {
                    param.H_name = $H_name.val();
                }
                if ($.trim($H_isbn.val())) {
                    param.H_isbn = $H_isbn.val();
                }
                if ($.trim($h_barcode.val())) {
                    param.h_barcode = $h_barcode.val();
                }
                if ($.trim($H_writer.val())) {
                    param.H_writer = $H_writer.val();
                }
                if ($.trim($h_publish.val())) {
                    param.h_publish = $h_publish.val();
                }
                if ($.trim($H_serial_book.val())) {
                    param.H_serial_book = $H_serial_book.val();
                }
                if ($.trim($start.val()) || $.trim($end.val())) {
                    param.H_update_date = {};
                    param.H_update_date.startTime = $start.val();
                    param.H_update_date.endTime = $end.val();
                }
                if ($.trim($minPrice.val()) || $.trim($maxPrice.val())) {
                    param.H_price = {};
                    param.H_price.minPrice = $minPrice.val();
                    param.H_price.maxPrice = $maxPrice.val();
                }
                if ($H_newbook.parent().attr('class').indexOf('active') !== -1) {
                    param.H_newbook = 1;
                }
                if ($H_qty_zero.parent().attr('class').indexOf('active') !== -1) {
                    param.H_qty_zero =1;
                }
                $h_type0.each(function () {
                    if ($(this).parent().attr('class').indexOf('active') !== -1) {
                        param.h_type01 = $(this).attr('value');
                    }
                })
                $h_type04.each(function () {
                    if ($(this).parent().attr('class').indexOf('active') !== -1) {
                        param.h_type04 = $(this).attr('value');
                    }
                })
                location.href = "/view/bookList.html?type=2&searchVal=" + JSON.stringify(param);
            })

        })

       
    });
});