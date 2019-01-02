# Popup
---------
该组件基于webpack(commonjs)+jquery


## 使用方法

`npm install free-popup --save`

```js
let popup = require('free-popup');

//基本用法
let _popup = new popup({
    trigger:'.ele',
    triggerType:'click',
    content:'test'
    ...
});
```

## 详细的参数列表
--------
### trigger 
触发对象（必填）: jquery 对象（string）

### triggerType
触发方式 (选填): 默认为 `click` 可选项如下：
- click
- hover
- 一切可能有的触发事件

### direction
冒泡框出现的方向（选填）: 默认为 `bottom` 可选项如下
- top
- right
- bottom 
- left

### position
冒泡框的位置定位，做微调 （选填）: `Array` 默认为[0,0]
`[X,Y]` 其中X表示X轴，Y表示Y轴

`目前不接受百分比传参`

### pointer
冒泡框的指针的位置定位，做微调 （选填）: `Array` 默认为[0,0]
`[X,Y]` 其中X表示X轴，Y表示Y轴

### width
冒泡框的宽度 接受 百分比 | string | number (px)

`百分比 相对父元素`

### height
冒泡框的高度 接受 百分比 | string | number (px)

`百分比 相对父元素`


### fixed
冒泡框定位方式是是否为绝对定位，为 `true` 的时候为 绝对定位

参数：`boolean` 

### style
修改冒泡框本身的样式

参数：object
```js
//例如
style:{
    'background':'red'
}
```

### pointerStyle
修改冒泡框 指针 本身的样式
参数：object
```js
//例如
style:{
    'background':'red'
}
```

### content
冒泡框内容,接受任意HTML

`内容为空的时候，冒泡框不会显示`

### pointerHide
是否隐藏 指针 为 `true` 的时候隐藏

参数：`boolean` 

### autoClose
开启当前冒泡框的时候自动隐藏其他冒泡框，默认为`true`

参数：`boolean` 

`false`的时候，不会自动隐藏本身

### autoInitContent

参数：`boolean` 

每次触发冒泡框显示的时候都会重新渲染冒泡框本身的内容，不重新传false

---------

## 回调函数

### show(str)
显示冒泡框

参数：`str`（string选填）内容会直接替换content内容

### hide()
隐藏冒泡框

### showBefore(cb)

显示冒泡框之前，触发`cb`回调

参数：`cb`（function选填）

### showAfter(cb)

显示冒泡框之后，触发`cb`回调

参数：`cb`（function选填）

### hideAfter(cb)

显示冒泡框之后，触发`cb`回调

参数：`cb`（function选填）

### setContent(cb)

可以改变组件本身的this属性，主要用于this.content。方法和其他function api 大同小异。区别在于，当popup是显示的状态下，会立马响应组件，重新渲染内容
