/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $ongoing=$(".ongoing");
            var $end=$(".end");
            var $rewards=$("#rewards");
            // 请求获得活动列表
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/activity',
                beforeGetLoading:true,
                success: function (data) {
                    callBack(data.data.processing,1);
                    callBack(data.data.past,2);
                }
            })
            function callBack(data,type) {
                var $dom=type==1?$ongoing:$end;
                var status=type==1?'进行中':'已结束';
                var statusIcon=type==1?'ing':'end';
                var showGo=type==1?'':'disn';
                var html = '';
                if (data.length==0) {
                    html += '<div class="margin-bottom-25">\
                                <div class="card">\
                                    <span class="'+statusIcon+' strip">'+status+'</span>\
                                    <div>\
                                        <p class="act-title">暂无活动</p>\
                                    </div>\
                                    <div class="time">\
                                        <p class="white font-12"></p>\
                                    </div>\
                                </div>\
                            </div>';
                    $dom.append(html);
                    return false;
                }
                $.each(data, function (index, el) {
                    html += '<div class="margin-bottom-25 JS_go"  id="'+el.id+'" type="'+type+'">\
                                <div class="card">\
                                    <span class="'+statusIcon+' strip">'+status+'</span>\
                                    <div>\
                                        <p class="act-title">'+el.title+'</p>\
                                    </div>\
                                    <div class="time">\
                                        <p class="white font-12">活动时间：'+$.getTime(el.created_at)+'-'+$.getTime(el.end_time)+'</p>\
                                    </div>\
                                </div>\
                                <a href="javascript:;" class="'+showGo+' icon icon-go white font-16"><strong>GO</strong>\
                                    <i class="icon icon-w-right"></i>\
                                </a>\
                            </div>'
                })
                $dom.append(html);
            }
            $rewards.on('click','.JS_go',function(){
                var id=$(this).attr('id');
                var type=$(this).attr('type');
                location.href='/view/activity.html?id='+id+'&type='+type;
            })
        })
    });
});