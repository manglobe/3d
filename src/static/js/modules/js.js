/**
 * Created by Administrator on 2016/7/19.
 */

/**
 * 
 */
import {plugIn} from 'plugIn.js';
import {highLight} from 'highLight.js';

var timer1, timer2, timer3; //定义全局计时器变量

$(document).ready(function () {
    Topnav('.top-nav');
    Topnav('.left-box');
    Topnav('.mobile-nav');

    imgTitle(".pro-list li", "span");
    imgTitle(".left-box li", "a");
    imgTitle(".news-list li", "a");


    bannerAnimate();
    // bottomNav();
    //导航效果
    // $('.top-nav li').mouseenter(function () {
    //     if ($(this).find('a').data('nav')) {
    //         $(this).children('a').addClass('active');
    //         $('.drop-down-menu').hide();
    //         $(this).find('.drop-down-menu').show().css('visibility', 'visible')
    //     }
    // }).mouseleave(function () {
    //     $('.drop-down-menu').css('visibility', 'hidden');
    //     if ($(this).find('a').data('nav')) {
    //         $(this).children('a').removeClass('active')
    //     }
    // });
    studio4_drop_down({
        wrap: '.top-nav',
        toggle: '.drop-down-toggle',
        menu: '.drop-down-menu'
    })
    //  底部导航关闭事件
    $('.drop-top-switch').click(function () {
        $('.flex-drop-top').css('display') === 'none' && !$('.flex-drop-top').is(":animated") ? $('.flex-drop-top').slideDown() : $('.flex-drop-top').slideUp()
    });
    $(document).mouseup(function (e) {
        var _con = $('.drop-top-switch,.flex-drop-top'); // 设置目标区域
        if (!_con.is(e.target) && _con.has(e.target).length === 0) {
            $('.flex-drop-top').slideUp()
        }
    });
});



/*  下拉菜单    */
var studio4_drop_down = function (box) {
    var wrap = box.wrap,
        toggle = box.toggle,
        menu = box.menu;
    $(wrap).find(toggle).unbind().click(function () {
        //console.log($(this).toggleClass("click_on").parent('li').siblings().find(toggle))
        $(this).toggleClass("click_on").parent('li').siblings().find(toggle).removeClass("click_on");
        $(this).parent('li').siblings().find(menu).slideUp(500);
        $(this).next(menu).slideToggle(300);
    });
    $(wrap).find(toggle).each(function () {
        if ($(this).is(".nav_on")) {
            $(this).next(menu).slideDown(300).end().toggleClass("click_on")
        }
    })
};



/*   图片title&alt
 *   引导文字 id='lead' 子标签为 <a>
 *   x为产品li元素
 *   y为产品名元素
 * */
var imgTitle = function (x, y) {
    if ($(".lead a").eq(2).is('a') == true) {
        var a = $('.lead a').last().getParentText().trim();
        $(x).each(function () {
            if ($(this).find(y).length === 1) {
                var b = $(this).find(y).eq(0).getParentText().trim();
                $(this).find('img,a,.grey-layer').attr({
                    'alt': b + '——' + a,
                    'title': b + '——' + a
                });
                // $(this).find('a').attr({
                //     'alt': b,
                //     'title': b
                // });
                // $(this).find('.grey-layer').attr({
                //     'alt': b + '——' + a,
                //     'title': b + '——' + a
                // }); 
            } else {
                $(x).find(y).each(function () {
                    var b = $(this).getParentText().trim();
                    $(this).attr({
                        'alt': b,
                        'title': b
                    });
                })
            }
        })
    } else { //一级内页 图片title
        $(x).each(function () {
            var word = $(this).find(y).eq(0).getParentText().trim();
            $(this).find('img').attr({
                'alt': word,
                'title': word
            });
            $(this).find('a').attr({
                'alt': word,
                'title': word
            })
        })
    }
    $('.more-icon , .read-more').attr('title', '了解更多'); //查看更多按钮添加title
};

/*   内页导航初始化位置   */
function bottomNav() {
    var _setpos = function (obj) {
        this.nav = obj.nav || ".nav-list";
        this.widths = [];
        this.init();
    };
    _setpos.prototype = {
        createNode: function () {
            var _this = this;
            var alllength = 0;
            $(_this.nav).find("li").each(function () {
                alllength += $(this).outerWidth() + 6;
                _this.widths.push($(this).outerWidth());
            });
            $(_this.nav).find("ul").css('minWidth', alllength + 1);
            var active_num = $(_this.nav).find(".active").parent("li").index();
            var sum_wid = 0;
            for (var i = 0; i < active_num; i++) {
                sum_wid += _this.widths[i];
            }
            $(_this.nav).scrollLeft(sum_wid)

        },
        init: function () {
            var _this = this;
            _this.createNode();
        }
    };
    //导航定位初始化
    var nav = new _setpos({
        nav: ".bottom-nav"
    });
}
/*  mobileDo*/
var mobileDo = function (callback) {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || $(window).width() < 992) {
        callback()
    }
};
/*    banner  */
function bannerAnimate() {
    mobileDo(function () {
        $('embed').hide();
        $('.pc-show').hide();
        $('.mobile-show').show();
    });
    bannerPPt1({
        img: '.banner img',
        nav: '.banner-nav', //需要导航则设置nav
        speed: 4000
    });

    if ($(window).width() <= 750) {
        $('.banner').find('.img-box').css('paddingTop', '46.67%');
        $('.banner').find('img').each(function () {
            var mbanner = $(this).attr('msrc');
            $(this).attr('src', mbanner)
        });
    }

}
var bannerPPt1 = function (banner) { //渐变
    clearTimeout(timer1); //清楚旧定时器，防止重复计时
    var bImg = $(banner.img);
    if (banner.nav) {
        var bNav = $(banner.nav);
        bNav.html("");
        for (var m = 0; m < bImg.length; m++) {
            bNav.append("<div></div>")
        }
        bNav.children().first().addClass('active');
        bNav.find('div').click(function () {
            i = $(this).index();
            showI(i);
        });
        bNav.mouseenter(function () {
            clearTimeout(timer1)
        }).mouseleave(function () {
            timer1 = setInterval(function () {
                i >= bImg.length - 1 ? i = 0 : i++;
                showI(i);
            }, banner.speed);
        })
    }
    var i = 1;
    var showI = function (i) {
        //bImg.hide().eq(i).fadeIn(1000);
        // bImg.fadeOut(800, function () {
        //     //$('#banner').height(bImg.height())
        //     setTimeout(function () {
        //         bImg.eq(i).fadeIn(800)
        //     }, 500)
        // });
        bImg.eq(i).fadeIn().siblings('img').hide();
        if (bNav) {
            bNav.children().removeClass("active").eq(i).addClass('active');
        }
        return i
    };
    timer1 = setInterval(function () {
        i >= bImg.length - 1 ? i = 0 : i++;
        showI(i);
    }, banner.speed);
};
var bannerPPt2 = function () {};
/*
 * 多行文本正则替换省略号
 * */
var ellipsisWord = function (string, num, ellipsis) { //文本替换
    var wordNum = new RegExp("[\\s+|\\S+]{" + (num) + "}");
    ellipsis = ellipsis === null ? '……' : ellipsis;
    if (string.match(wordNum)) {
        return string.match(wordNum)[0] + ellipsis;
    } else {
        return string;
    }
};
$.fn.getTextXLength = function () { //X轴文本长度
    return parseInt(this.width() / parseInt(this.css('fontSize')));
};
$.fn.getTextYLength = function () { //Y轴文本长度
    var obj = this;
    return parseInt(obj.outerHeight() / parseInt(obj.css('lineHeight') === 'normal' ?
        obj.css('fontSize') : /px/g.test(obj.css('lineHeight')) ? //浏览器默认样式 | line-height为浮点数
        obj.css('lineHeight') : obj.css('lineHeight') * parseInt(obj.css('fontSize'))));
};
var ellipsisText = function (textWrap) {
    $(textWrap.target).each(function () {
        var obj = $(this);
        var text;
        if (textWrap.num) {
            text = ellipsisWord(obj.getParentText(), textWrap.num, textWrap.ellipsis);
        } else {
            var x = textWrap.X || obj.getTextXLength();
            var y = textWrap.Y || obj.getTextYLength();
            var xy = x * y - 1;
            //console.log(xy,obj.text())
            text = ellipsisWord(obj.getParentText(), xy, textWrap.ellipsis);
        }
        obj.changeParentText(text)
    });
};
/*
 *  iframe高度自适应
 * */
var changeHeight = function (target) {
    var $t = $(target);
    $t.height($t.contents().height());
    $t.contents().click(function () {
        $t.height($t.contents().find('body').height())
    })
};