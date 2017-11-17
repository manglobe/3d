var plugIn = function () {
    //ie8以下 trim()兼容
    String.prototype.trim = function () {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
    //
    Array.prototype.haveElement = function (ele) {
        for (x in this) {
            if (this[x] == ele) return true;
        }
        return false;
    };
    (function ($) {　　
        $.fn.getParentText = function () { //抽离父元素文本
            return $(this).contents().filter(function (index, content) {
                return content.nodeType === 3;
            }).text();
        };
        $.fn.changeParentText = function (text) {
            $(this).contents().filter(function (index, content) {
                return content.nodeType === 3;
            })[0].nodeValue = text
            return $(this);
        }
        $.fn.getElementBaseText = function () { //去除空格，转换大写
            return $(this).getParentText().replace(/\s+/g, "").toUpperCase()
        };
    })(jQuery);
};

export {plugIn};