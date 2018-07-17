/**
 * Created by luoyilin
 */
require(["entry"], function (CONST) {
  require(["common", "swiper"], function ($, Swiper) {
    $(function () {
      var $recommend = $("#recommend");
      var $drap = $("#JS_drap");
      var $meun = $(".menu");
      var $list = $("#JS_list");
      var $wlb = $("#wlb");
      var $meunLink = $(".JS_menu a");
      var $navLink = $("#JS_recommend_tab .swiper-wrapper a");
      var $navItem = $("#JS_recommend_tab .item");
      var $empty = $("#JS_empty");
      // 请求获得模块列表
      $.isLogin();
      getData([3, 2]);

      function getData(fLooker) {
        var $loadingMore = $("#JS_loading_more");
        var $loaded = $(".JS_loaded", $loadingMore);
        var param = '';
        $.each(fLooker, function (index, el) {
          param = param + 'fLooker[' + index + ']=' + el + '&';
        })
        $list.empty();
        $list.hide();
        $wlb.hide();
        $loadingMore.hide();
        $loaded.hide().prev().show();
        $(window).unbind('scroll');
        $.getData({
          type: 'get',
          url: '/list_of_books/santong?' + param,
          beforeGetLoading: true,
          success: function (data) {
            var oReturn = callBack(data);
            if (oReturn) {
              $.loadMore(data.data, 'list_of_books/santong?' + param, callBack);
            }
          }
        })
      }

      function callBack(data) {
        var data = data.data.data;
        var html = '';
        if (data.length == 0) {
          $list.hide();
          $wlb.hide();
          $empty.fadeIn();
          return false;
        }
        $.each(data, function (index, el) {
          html += '<div class="card">\
                     <a href="/view/bookList.html?type=8&ftitle='+el.ftitle+'&fCode=' + el.fcode + '">\
                        <i class="icon icon-recommend"></i>\
                        <p>\
                            <span class="font-16 margin-right-5">' + el.ftitle + '</span>\
                        </p>\
                     </a>\
                   </div>'
        })
        $list.append(html);
        $empty.hide();
        $list.fadeIn();
        $wlb.fadeIn();
        return true;
      }
      $drap.click(function (e) {
        e.stopPropagation();
        $meun.fadeToggle();
      })
      $(document).click(function () {
        $meun.fadeOut();
      })
      $navItem.click(function () {
        var fLooker = $(this).children().attr('flooker');
        var fLookerArr = [];
        if (fLooker == 'all') {
          fLookerArr = [3, 2];
        } else if (fLooker == 3) {
          fLookerArr = [3];
        } else {
          fLookerArr = [2];
        }
        $(this).siblings().children('a').removeClass('active');
        $(this).children('a').addClass('active');
        getData(fLookerArr);
      })
      $meunLink.click(function () {
        var index = $(this).parent().index();
        var fLooker = $navItem.eq(index).children().attr('flooker');
        var fLookerArr = [];
        if (fLooker == 'all') {
          fLookerArr = [3, 2];
        } else if (fLooker == 3) {
          fLookerArr = [3];
        } else {
          fLookerArr = [2];
        }
        $navItem.eq(index).siblings().children('a').removeClass('active');
        $navItem.eq(index).children('a').addClass('active');
        getData(fLookerArr);
      })
    })
  });
});