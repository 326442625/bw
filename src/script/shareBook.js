/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common", "swiper"], function ($, Swiper) {
        $(function () {
            var $share = $("#share-book");
            var $newBook = $("#JS_new_book");
            var $addBook = $("#JS_add_book");
            var $pop = $("#JS_pop");
            var $edit = $("#JS_edit");
            var $com = $("#JS_com");
            var $del = $("#JS_del")
            var $list = $("#JS_list");
            // 请求获取我的书单列表
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/book_list_share',
                beforeLoading: {
                    el: $share
                },
                success: function (data) {
                    shareBookCallBack(data.data);
                }
            })

            function shareBookCallBack(data) {
                var html = '';
                if (data.length == 0) {
                    html += '<div class="empty-status text-center">\
                            <img src="/images/empty-order.png">\
                            <p class="gray">没有相关书单~</p>\
                        </div>';
                    $list.html(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    html += '<div class="card" data-id="' + el.raw_id + '">\
                   <div class="title padding-left-12 bg-white"><label class="checkbox margin-right-12 edit-status">\
                           <input type="checkbox" data-id="' + el.id + '">\
                           <i class="icon icon-login-no-checked"></i>\
                           <i class="icon icon-login-checked"></i>\
                       </label><span class="font-16 black JS_name">' + el.list_name + '</span><a href="javascript:;" class="black-a f-right margin-right-12 JS_link"><span class="margin-right-8 font-15 JS_num">0</span><i class="icon icon-right"></i></a></div>\
                   <div class="swiper-container JS_link" id="'+el.raw_id +'">\
                       <div class="swiper-wrapper">\
                            <div class="book-loading text-center margin-right-12">\
                              <i class="icon icon-loading2 margin-right-5"></i>加载中...\
                            </div>\
                       </div>\
                   </div>\
                </div>'
                })
                $list.html(html);
                var $card = $list.find('.card');
                $card.each(function () {
                    var _this=$(this);
                    var raw_id = _this.data('id');
                    var $swiper = _this.find('.swiper-wrapper');
                    var $num=_this.find('.JS_num');
                    if (_this.offset().top <= $(window).height()) {
                        _this.data('status',true);
                        $.getData({
                            type: 'get', 
                            url: '/book_list_share_info?book_list_share_raw_id=' + raw_id,
                            success: function (data) {  
                                var data=data.data;
                                var html='';
                                $.each(data.data, function (index, el) {
                                     html += '<div class="img-warpper swiper-slide text-center margin-right-12 bg-white">\
                                            <img src="' + CONST.BaseBookImg + '/' + el.H_images + '_180x180" height="100%">\
                                        </div>'
                                })
                                if(data.data.length!==0){
                                    $num.html(data.total);
                                    $swiper.html(html);
                                }else{
                                    $swiper.html('<div class="book-loading">暂无图书<div>');
                                }
                                new Swiper('#'+raw_id, {
                                    freeMode : true, 
                                    slidesPerView : 'auto'
                                })
                                _this.data('status',true);
                            },
                            error:function(){
                                _this.data('status',false);
                            }

                        })
                    }  
                })
            } 
            // 滚动加载
            $(document).scroll(function(){ 
                var $card = $list.find('.card');
                $card.each(function () {
                    var _this=$(this);
                    var raw_id = _this.data('id');
                    var $swiper = _this.find('.swiper-wrapper');
                    var $num=_this.find('.JS_num');
                    if ((_this.offset().top <= ($(window).height()+$(document).scrollTop()))&&!_this.data('status')) {
                        _this.data('status',true);
                        $.getData({
                            type: 'get',  
                            url: '/book_list_share_info?book_list_share_raw_id=' + raw_id,
                            success: function (data) { 
                                var data=data.data;
                                var html='';
                                $.each(data.data, function (index, el) {
                                     html += '<div class="img-warpper swiper-slide text-center margin-right-12 bg-white">\
                                            <img src="' + CONST.BaseBookImg + '/' + el.H_images + '_180x180" height="100%">\
                                        </div>'
                                })
                                if(data.data.length!==0){
                                    $num.html(data.total);
                                    $swiper.html(html);
                                }else{
                                    $swiper.html('<div class="book-loading">暂无图书<div>');
                                }
                                new Swiper('#'+raw_id, {
                                    freeMode : true, 
                                    slidesPerView : 'auto'
                                })
                                _this.data('status',true);
                            },
                            error:function(){
                                _this.data('status',false);
                            }
                        })
                    }  
                })
            })
            // 弹窗
            $newBook.click(function () {
                var $input = $pop.find('input');
                $input.val('');
                $.pop({
                    el: $pop,
                    clickMaskClose: true,
                    forbidScroll: true
                });
            })
            // 编辑
            $edit.click(function () {
                var $disn = $(".edit-status");
                $(this).hide();
                $disn.show();
            })
            // 完成
            $com.click(function () {
                var $disn = $(".edit-status");
                $edit.show();
                $disn.hide();
            })
            // 添加
            $addBook.click(function () {
                var $input = $pop.find('input');
                var val = $input.val();
                if (!$.trim(val)) {
                    layer.msg('请填写书单名~');
                    return false;
                }
                $.getData({
                    type: 'post',
                    url: '/book_list_share',
                    param: {
                        list_name: val
                    },
                    success: function (data) {
                        if (data.code == 201) {
                            layer.msg('新建成功', {
                                time: 2000
                            }, function () {
                                location.href = '/view/shareBook.html';
                            });
                        }
                    }
                })
            })
            // 删除
            $del.click(function () { 
                var $inputChecked = $list.find('input[type=checkbox]:checked');
                var $items = $list.find('.card');
                var $item;
                var idArr = [];
                $inputChecked.each(function () {
                    var list_id = $(this).data('id');
                    $item = $(this).parents('.card');
                    idArr.push(list_id);
                })
                if (idArr.length == 0) {
                    layer.msg('请选择书单');
                    return false;
                }
                $.getData({
                    type: 'delete',
                    url: '/book_list_share',
                    param: {
                        list_id: idArr
                    },
                    success: function (data) {
                        layer.msg('删除成功', {
                            time: 2000
                        }, function () {
                            location.href = '/view/shareBook.html';
                        });
                    }
                })
            })
            // 跳转到分享书单
            $list.on('click','.JS_link',function(e){ 
                var raw_id=$(this).parents('.card').data('id');
                var name=$(this).parents('.card').find('.JS_name').html();
                location.href='/view/shareBookList.html?id='+raw_id+'&bookName='+name;
            })
        })
    });
});