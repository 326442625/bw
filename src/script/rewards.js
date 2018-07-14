/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
    require(["common"], function ($) {
        $(function () {
            var $ongoing=$(".ongoing");
            var $end=$(".end");
            var $noStart=$(".no-start")
            var $rewards=$("#rewards");
            var processing=[];
            var past=[];
            var notStart=[];
            // 请求获得活动列表
            $.isLogin();
            $.getData({
                type: 'get',
                url: '/activity_list',
                beforeGetLoading:true,
                success: function (data) {
                    var nowDate=new Date().getTime(); 
                    $.each(data.data,function(index,el){ 
                        if(el.start_time*1000>nowDate){
                            notStart.push(el);
                        }else if(el.start_time*1000<=nowDate&&nowDate<el.end_time*1000){
                            processing.push(el);
                        }else{
                            past.push(el)
                        }
                    })  
                    callBack(processing,1);
                    callBack(past,2);
                    callBack(notStart,3);
                }
            })
            function callBack(data,type) {
                if(type==1){
                    $dom=$ongoing;
                    status='进行中';
                    statusIcon='ing';
                    showGo='';
                }else if(type==2){
                    $dom=$end;
                    status='已结束';
                    statusIcon='end';
                    showGo='disn';
                } else{
                    $dom=$noStart;
                    status='未开始';
                    statusIcon='end';
                    showGo='disn'; 
                }
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
                                        <p class="white font-12">活动时间：'+$.timeStamp(el.start_time*1000)+'-'+$.timeStamp(el.end_time*1000)+'</p>\
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