/**
 * Created by 小志 on 2017/10/31.
 */

/**
 * 如何使用
 const popup = require('popup');
 let _popup = new popup({
        trigger :'',              //触发目标
        triggerType :'click',     //触发方式 默认为click、各种事件都支持
        direction :'bottom',      //弹框的方向，基于trigger目标 有：top(上左)、right(右上)、bottom(下左)、left(左上)，默认为bottom (下左)  四个参数，配合position调整位置
        position :[0, 0],         //基于direction 的位置 做微调 传参为：[x,y] 微调 默认为[0.0]
        pointer :[0, 0],          //指针的位置，基于弹框本身 对应为top: 四边形下左、right:右上)、bottom:下左)、left:左上)，默认为bottom :下左)  传参为：(x,y) 微调 默认为[0.0]
        width :string | number,   //弹框的宽度   默认为
        height :string | number,  //弹框的高度   默认为
        fixed :false,             //定位方式是绝对定位，true为fixed(position:fixed),适用于给目标为fixed的场景
        style :{},                //直接传对象，修饰弹框样式   默认为空
        pointerStyle :{},         //直接传对象，修饰指针样式   默认为空
        content :'',              //弹框内容       默认为空
        pointerHide:false,        //隐藏冒泡三角形，默认为false
        autoClose:false,          //开启其他popup的时候自动隐藏其他popup，默认为true，false的时候，不会自动隐藏本身
        autoInitContent:false,    //每次show都会重新，默认为true,不启动传false
 })
 * 提供的方法：
 * show:function(){},
 * hide:function(){},
 * showBefore:function(){},   //显示回调
 * showAfter:function(){}
 * hideAfter:function(){}    //隐藏回调
 *
 */

'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('../scss/common-popup');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = require('jquery');
var POINTER_HEIGHT = 5 + 2; //指针的高度 +2是加点空隙
var $popup_arr = {}; //存放所有popup对象
var popup_arr = {}; //存放所有popup对象
var $window = $(window);

var api = function () {
  function api() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var cb = arguments[1];

    _classCallCheck(this, api);

    if (!$(opts.trigger).length && !(opts.trigger instanceof $)) return null;

    for (var o in popup_arr) {
      if (popup_arr[o].trigger === opts.trigger.trim()) {
        return null;
      }
    }

    //设置默认值
    this.constructor._default.call(this);
    for (var key in opts) {
      if (key === 'width' || key === 'height') {
        this['_' + key] = opts[key];
      }
      this[key] = opts[key];
    }
    //获取目标元素的偏移量和本身整体
    this.constructor._getTriggerOffset.call(this);

    //该版本
    var version = this.version = +new Date();
    //该实例对象
    var slotDom = this.Popup = '<div class="common_popup' + version + ' common_popup v_hide ' + (this.autoClose ? '' : 'autoClose') + '"></div>';

    //该实例$对象
    var $slotDom = this.$Popup = $(slotDom);

    //保存该popup对象
    $popup_arr[version] = this.$Popup;
    popup_arr[version] = this;

    //给实例对象添加基本DOM
    $slotDom.html('<div class="_common-popup _common-popup' + this.version + '">\n        ' + (this.pointerHide ? '' : '<span class="pointer"></span>') + '\n        <div class="_common-popup-content"></div>\n      </div>');

    //该实例插槽
    var $slotContent = this.$PopupContent = $slotDom.find('._common-popup-content');

    //将实例插入页面
    this.constructor._setPopupContent.call(this, this.content);
    $('body').append($slotDom);

    //该实例指针
    var pointer = this.$pointer = $slotDom.find('.pointer');

    //元素插入之后设置实例的偏移量
    this.constructor._setTriggerPosition.call(this);

    //设置指针偏移
    this.constructor._setPointerPosition.call(this);

    //设置弹框的样式
    this.constructor._setPopupStyle.call(this);

    //页面事件
    this.constructor.otherBind.call(this);

    //设置事件流
    this.constructor.eventTrigger.call(this);

    //回调事件
    if (cb && typeof cb === 'function') {
      try {
        cb.apply(this, arguments);
      } catch (e) {
        console.log('callback error');
      }
      return this;
    }

    //设置指针的样式
    this.constructor._setPointerStyle.call(this);

    return this;
  }

  _createClass(api, [{
    key: 'show',
    value: function show(strDom) {
      var _this = this;

      this.showBeforeCb && this.showBeforeCb();
      if (!this.content) return this; //没内容 不显示
      this.autoInitContent && this.constructor._setPopupContent.call(this, strDom);
      this.constructor._setTriggerPosition.call(this, true); //重新计算

      for (var key in popup_arr) {
        if (!popup_arr[key].$Popup.hasClass('autoClose')) {
          popup_arr[key].hide();
        }
      }

      this.$trigger.attr('active', 'true').data('active', 'true');

      setTimeout(function () {
        _this.$Popup.removeClass('v_hide');
      }, 100);
      this.showAfterCb && this.showAfterCb();
      return this;
    }
  }, {
    key: 'showAim',
    value: function showAim(ele) {
      ele.show();
      return this;
    }
  }, {
    key: 'showAfter',
    value: function showAfter(cb) {
      this.showAfterCb = cb;
      return this;
    }
  }, {
    key: 'showBefore',
    value: function showBefore(cb) {
      this.showBeforeCb = cb;
      return this;
    }
  }, {
    key: 'hideAfter',
    value: function hideAfter(cb) {
      this.hideAfterCb = cb;
      return this;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$Popup.addClass('v_hide');
      this.$trigger.removeAttr('active').data('active', '');
      this.hideAfterCb && this.hideAfterCb();
      return this;
    }
  }, {
    key: 'justShow',
    value: function justShow(strDom) {
      this.autoInitContent && this.constructor._setPopupContent.call(this, strDom);
      this.constructor._setTriggerPosition.call(this, true); //重新计算

      for (var key in $popup_arr) {
        if ($popup_arr[key].hasClass('autoClose')) break;
        $popup_arr[key].addClass('v_hide');
      }
      this.$Popup.removeClass('v_hide');

      this.showAfter && this.showAfter();
      return this;
    }
  }, {
    key: 'justHide',
    value: function justHide() {
      this.$Popup.addClass('v_hide');
    }
  }, {
    key: 'hideAim',
    value: function hideAim(ele) {
      ele.hide();
      return this;
    }
  }], [{
    key: '_default',
    value: function _default() {
      this.trigger = ''; //触发目标
      this.triggerType = ''; //触发方式 默认为click、各种事件都支持
      this.direction = 'bottom'; //弹框的方向，基于trigger目标 有：top(上左)、right(右上)、bottom(下左)、left(左上)，默认为bottom (下左)  四个参数，配合position调整位置
      this.position = [0, 0]; //基于this.direction 的位置 做微调 传参为：[x,y] 微调
      this.pointer = [0, 0]; //指针的位置，基于弹框本身 对应为top: 四边形下左、right:右上)、bottom:下左)、left:左上)，默认为bottom :下左)  传参为：(x,y) 微调
      this.width = 220; //弹框的宽度
      this.height = 'auto'; //弹框的高度
      this.fixed = false; //定位方式是绝对定位，true为fixed
      this.style = {}; //直接传对象，修饰弹框样式
      this.content = ''; //弹框内容
      this.activeTrigger = '';
      this.pointerHide = false; //隐藏三角形默认为false
      this.autoClose = true; //
      this.autoInitContent = true; //自动初始化content
      this.debug = false; //调试模式
      this.pointerStyle = false; //设置指针样式，默认为false
    }

    //获取对象的offset

  }, {
    key: '_getTriggerOffset',
    value: function _getTriggerOffset() {
      this._trigger = this.trigger;
      this.$trigger = this.trigger instanceof $ ? this.trigger : $(this.trigger);

      if (!this.$trigger.length) {
        throw new Error('\u3010' + this._trigger + '\u3011is undefined, can`t find this jquery elem');
      }
      if (this.activeTrigger) this.$trigger = this.activeTrigger;

      var trigger_top = this.$trigger.offset().top;
      var trigger_left = this.$trigger.offset().left;
      var trigger_height = this.$trigger.outerHeight();
      var trigger_width = this.$trigger.outerWidth();

      this.trigger_info = {
        top: this.fixed ? +trigger_top - $window.scrollTop() : +trigger_top,
        left: +trigger_left,
        height: +trigger_height,
        width: +trigger_width
      };
      if (this.debug) {
        console.log('该实例目标info', this.trigger_info);
      }
    }

    //设置弹窗的位置

  }, {
    key: '_setTriggerPosition',
    value: function _setTriggerPosition(reset) {

      reset && this.constructor._getTriggerOffset.call(this);

      var obj = {};
      var $_common_popup = this.$Popup.find('._common-popup' + this.version);

      var _width = $_common_popup.outerWidth();
      var _height = $_common_popup.outerHeight();

      if (this.debug) {
        console.log('该实例弹窗自身的宽、高', _width, _height);
      }

      this.trigger_position = { //[x,y]
        top: [this.trigger_info.left, this.trigger_info.top - _height - POINTER_HEIGHT],
        left: [this.trigger_info.left - _width - POINTER_HEIGHT, this.trigger_info.top],
        right: [this.trigger_info.left + this.trigger_info.width + POINTER_HEIGHT, this.trigger_info.top],
        bottom: [this.trigger_info.left, this.trigger_info.top + this.trigger_info.height + POINTER_HEIGHT]
      };

      if (this.fixed) {
        obj = {
          position: 'fixed'
        };
      }

      $.extend(obj, {
        left: this.trigger_position[this.direction][0] + this.position[0], //大胆用有默认值
        top: this.trigger_position[this.direction][1] + this.position[1] //大胆用有默认值
      });
      this.$Popup.find('._common-popup' + this.version).css(obj);
    }

    //设置指针偏移

  }, {
    key: '_setPointerPosition',
    value: function _setPointerPosition() {
      var _x = this.pointer[0];
      var _y = this.pointer[1];
      switch (this.direction) {
        case 'bottom':
        {
          var unit = this.constructor._getUnit.call(this, _x);
          var num = this.constructor._getNum.call(this, _x);
          this.$pointer.css({
            'left': unit === '%' ? num + unit : 10 + num + unit,
            'top': -5 + 'px'
          });
          break;
        }
        case 'top':
        {
          var _unit = this.constructor._getUnit.call(this, _x);
          var _num = this.constructor._getNum.call(this, _x);
          this.$pointer.css({
            'left': _unit === '%' ? _num + _unit : 10 + _num + _unit,
            'bottom': -5 + 'px'
          });
          break;
        }
        case 'right':
        {
          var _unit2 = this.constructor._getUnit.call(this, _y);
          var _num2 = this.constructor._getNum.call(this, _y);
          this.$pointer.css({
            'left': -5 + 'px',
            'top': _unit2 === '%' ? _num2 + _unit2 : 10 + _num2 + _unit2
          });
          break;
        }
        case 'left':
        {
          var _unit3 = this.constructor._getUnit.call(this, _y);
          var _num3 = this.constructor._getNum.call(this, _y);
          this.$pointer.css({
            'right': -5 + 'px',
            'top': _unit3 === '%' ? _num3 + _unit3 : 10 + _num3 + _unit3
          });
          break;
        }
      }
      this.$pointer.addClass(this.direction);
    }

    //设置指针的样式

  }, {
    key: '_setPointerStyle',
    value: function _setPointerStyle() {
      try {
        if (_typeof(this.pointerStyle) === 'object') {
          this.$pointer.css({
            'background': 'red'
          });
        }
      } catch (e) {
        console.log('pointer style parameters passed in the wrong format');
      }
    }

    //设置弹框的宽高等样式

  }, {
    key: '_setPopupStyle',
    value: function _setPopupStyle() {
      var objClass = {
        width: this.constructor._getNum.call(this, this._width) + this.constructor._getUnit.call(this, this._width),
        height: this.constructor._getNum.call(this, this._height) + this.constructor._getUnit.call(this, this._height)
      };
      $.extend(objClass, this.style);

      //初始化第一次，因为可能宽度是%的原因
      this.$Popup.find('._common-popup' + this.version).css(objClass);

      var width_ed = +this.$Popup.find('._common-popup' + this.version).css('width').replace(/[^0-9]/ig, '');
      var isOverflow = width_ed + this.$trigger.offset().left + this.position[0] > $window.width();

      if (isOverflow) {
        objClass.width = 'auto';
        //初始化第二次，因为如果设置的宽度超过屏幕边缘，返回width=auto
        this.$Popup.find('._common-popup' + this.version).css(objClass);
      }

      var pointerStyle = {
        'background': objClass.background ? objClass.background : '#FFFFFF'
      };

      pointerStyle && this.$Popup.find('._common-popup' + this.version + ' .pointer').css(pointerStyle);
    }

    //获取单位

  }, {
    key: '_getUnit',
    value: function _getUnit(str) {
      return (str + '').indexOf('%') > -1 ? '%' : 'px';
    }

    //获取数值

  }, {
    key: '_getNum',
    value: function _getNum(str) {
      return Number.parseFloat(str);
    }

    //设置弹框内容

  }, {
    key: '_setPopupContent',
    value: function _setPopupContent(strDom) {
      var _strDom = strDom ? strDom : this.content;
      this.$PopupContent.html(_strDom);
    }

    //点击页面隐藏

  }, {
    key: 'otherBind',
    value: function otherBind() {
      var _this2 = this;

      //防止重复触发
      $(document).off("click.popup_mark");
      $(document).on('click.popup_mark', function (e) {
        if (!$(e.target).parents('.common_popup').length) {
          for (var key in popup_arr) {
            //已经展开
            if (!popup_arr[key].$Popup.hasClass('v_hide')) {
              popup_arr[key].hide();
            }
          }
        }
      });

      //resize
      $window.resize(function () {
        //当浏览器大小变化时
        for (var key in $popup_arr) {
          if (!$popup_arr[key].hasClass('v_hide')) {
            _this2.constructor._setTriggerPosition.call(_this2, true); //重新计算
          }
        }
      });
    }

    //事件流

  }, {
    key: 'eventTrigger',
    value: function eventTrigger() {
      var that = this;
      if (!that.triggerType.trim()) return;
      if (that.triggerType === 'focus') that.triggerType = 'click';

      if (that.triggerType === 'hover') {
        $(document).on('mouseenter', that['_trigger'], function () {
          that.activeTrigger = $(this);
          clearTimeout(that.timeout);
          that.showAim(that);
        }).on('mouseleave', that['_trigger'], function () {
          that.activeTrigger = $(this);
          that.constructor._timeout.call(that, that);
        }).on('mouseenter', '._common-popup' + this.version, function () {
          clearTimeout(that.timeout);
          //._common-popup${this.version}
        }).on('mouseleave', '._common-popup' + this.version, function () {
          that.hideAim(that);
        });
      } else {
        $(document).on(that['triggerType'], that['_trigger'], function () {
          var $this = $(this);
          if ($this.data('active')) {
            that.hide();
          } else {
            that.activeTrigger = $(this);
            that.showAim(that);
          }
          // return false;
        });
      }
    }
  }, {
    key: '_timeout',
    value: function _timeout(ele) {
      var _this3 = this;

      this.timeout = setTimeout(function () {
        _this3.hideAim(ele);
      }, 160);
    }
  }]);

  return api;
}();

module.exports = api;