/**
 * jquery弹窗组件
 */
void function($, plus_name ,Parent) {
    var $bd = $('body'),
    $win = $(window),
    fn = $.fn[plus_name] = function(opt) {
        // opt 为字符串时，进行插件操作，操作的方法为opt
        // 往后的参数将为方法的参数
        if (typeof opt == 'string') {
            var args = [].slice.call(arguments),
                _opt = $.extend({}, fn.setting),
                result;
            this.each(function(i, el) {
                var data = new Kernel(el, _opt);
                result = data[opt].apply(data, args);
                // 如果有返回值，则退出
                if (result !== void 0) return false;
            });
            // 如果有返回值，则退出，并且返回值
            if (result !== void 0) return result;
            return this;
        } else {
            opt = $.extend({}, fn.setting, opt);
            return this.each(function(i, el) {
                new Kernel(el, opt);
            });
        }
    };

    // 默认配置
    fn.setting = $.extend({} ,Parent.setting ,{
        // 默认confirm选择器
        confirmSelector: '.confirm',
        // 默认input选择器
        inputSelector: '.input'
    });

    fn.constructor = Kernel;

    // 继承
    Kernel.prototype = function(_){
        _.prototype = Parent.constructor.prototype;
        return new _;
    }(function(){});

    // 静态继承
    $.extend(Kernel ,Parent.constructor);

    // 核心对象构造函数
    function Kernel(element, opt) {
        var $element = $(element),
        self = $element.data(plus_name);
        if (self) return self;

        self = this;
        self.$element = $element;
        // 操作对象保存到元素中
        $element.data(plus_name, self);

        self.setting = opt;

        // 继承 构造函数
        Parent.constructor.apply(self ,arguments);
    }

    // confirm
    Kernel.prototype.confirm = function() {
        var self = this;
        var e = $.Event( plus_name+'.confirm' );
        self.$element.trigger(e ,[self.$element.find(self.setting.inputSelector).val()])
        if(!e.isDefaultPrevented()){
            self.close();
        }
    }
    // 初始化
    Kernel.prototype.init = function() {
        var self = this;
        Parent.constructor.prototype.init.apply(self ,arguments);

        // 默认确认
        self.$element.on('click', self.setting.confirmSelector, function() {
            self.confirm();
        });
    }

    $win.keydown(function(e){
        // Enter键关闭
        if(e.keyCode == 13 && Kernel.activeAlerts.length){
            Kernel.activeAlerts[Kernel.activeAlerts.length-1].confirm();
            e.preventDefault();
        }
    });
}(jQuery, 'confirm' ,jQuery.fn.alert);
