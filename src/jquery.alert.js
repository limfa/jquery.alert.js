/**
 * jquery弹窗组件
 */
void function($, plus_name) {
    var $bd = $('body'),
    $win =$(window) , 
    // 原body overflow 样式
    _ooverflow;
    fn = $.fn[plus_name] = function(opt) {
        // opt 为字符串时，进行插件操作，操作的方法为opt
        // 往后的参数将为方法的参数
        if (typeof opt == 'string') {
            var args = [].slice.call(arguments ,1),
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
    $(function(){
        $bd = $('body');
    });

    // 默认配置
    fn.setting = {
        // z-index
        zIndex: 99999,
        // 活动类
        activeClass: 'active',
        // 幕布类
        maskClass: 'mask',
        // 数据
        data: {},
        // 动画时间
        time: 'normal',
        // 默认关闭选择器
        closeSelector: '.close'
    };

    fn.constructor = Kernel;

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

        // 原body overflow 样式
        // self._ooverflow;
        // resize事件
        self._resize = function() {
            var _h = $element.outerHeight(),
                _w = $element.outerWidth();
            $element.parent().css({
                width: _w > $win.width() ? _w : '100%',
                height: _h > $win.height() ? _h : '100%'
            });
        };
        // 状态 hide show
        self.state = 'hide';
        // 背景布
        self.$mask;

        self.init();
    }

    // 更新数据
    Kernel.prototype.updateData = function(data) {
        var self = this;
        $.each(data || self.setting.data, function(k, v) {
            var $el = $(k, self.$element);
            if (typeof v == 'string' || typeof v == 'number') {
                if($el.is(':input')){
                    $el.val(v);
                }else if($el.is('img')){
                    $el.attr('src' ,v);
                }else{
                    $el.html(v);
                }
            } else if ($.isFunction(v)) v($el);
        });
    }
    // 弹出
    // 宽高不够补滚动条
    Kernel.prototype.open = function() {
        var self = this
        if (self.state == 'hide') {
            var activeClass = self.setting.activeClass;
            self.state = 'show';
            self.$element.appendTo($bd)
                .wrap('<div style="position:fixed;top:0;right:0;bottom:0;left:0;overflow:auto;width:100%;height:100%;z-index:'+self.setting.zIndex+'"></div>')
                .wrap('<div style="position:relative;width:100%;height:100%;"></div>')
                .hide().fadeIn(self.setting.time);
            // 弹出前事件
            self.$element.trigger(plus_name + '.beforeopen');
            // 加类
            activeClass && self.$element.addClass(activeClass);
            self.$mask.insertBefore(self.$element).fadeTo(self.setting.time, .5 ,function(){
                // 弹出后事件
                self.$element.trigger(plus_name + '.open');
            });
            self.setCenter();

            // self._ooverflow = document.body.style.overflow;
            if(!Kernel.activeAlerts[0]){
                _ooverflow = document.body.style.overflow;
            $bd.css('overflow', 'hidden');
            }
            $win.on('resize', self._resize).trigger('resize');

            // 加入活动窗体
            Kernel.activeAlerts.push(self);
        }
    }
    // 关闭
    Kernel.prototype.close = function() {
        var self = this;
        if (self.state == 'show') {
            var activeClass = self.setting.activeClass;
            self.state = 'hide';
            self.$mask.fadeOut();
            // 关闭前事件
            self.$element.trigger(plus_name + '.beforeclose');
            // 去类
            activeClass && self.$element.addClass(activeClass);
            self.$element.fadeOut(self.setting.time, function() {
                self.$element.unwrap().unwrap();
                // 关闭后事件
                self.$element.trigger(plus_name + '.close');
            });

            $win.off('resize', self._resize)

            // 从活动窗体除去
            var l = Kernel.activeAlerts.length;
            while(l--){
                if(Kernel.activeAlerts[l] == self){
                    Kernel.activeAlerts.splice(l ,1);
                    break;
                }
            }
            // body overflow 复原
            if(!Kernel.activeAlerts[0]){
                $bd.css('overflow', _ooverflow);
            }
        }
    }
    // 设置屏幕居中
    Kernel.prototype.setCenter = function() {
        var self = this;
        var wid = self.$element.outerWidth(),
        hei = self.$element.outerHeight();
        self.$element.css({
            position: 'absolute',
            left: '50%',
            top: '50%',
            marginLeft: -wid / 2,
            marginTop: -hei / 2
        });
    }
    // 初始化
    Kernel.prototype.init = function() {
        var self = this;
        self.$mask = $('<div class="' + self.setting.maskClass + '" style="display:none"></div>');
        self.updateData();
        // 默认关闭
        self.$element.on('click', self.setting.closeSelector, function() {
            self.close();
        });
    }
    // 活动弹窗
    Kernel.activeAlerts = [];

    $win.keydown(function(e){
        // ESC键关闭
        if(e.keyCode == 27 && Kernel.activeAlerts.length){
            Kernel.activeAlerts[Kernel.activeAlerts.length-1].close();
        }
    })
}(jQuery, 'alert');
