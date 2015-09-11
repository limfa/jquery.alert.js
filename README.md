jquery.alert.js - 弹出插件
====
可继承的jQuery弹窗插件

go to [DEMO](http://dmnote.uinav.cn/codemanager.php?a=list&id=37) 


## 版本历史
* 2015/09/11
    1. 弹窗禁止滚动后对原本弹窗里的可滚动元素也限制了，修复，需添加参数 scrollSelector
* 2015/08/22
    1. 弹窗禁止滚动，对mousewheel DOMMouseScroll事件 preventDefault
    2. esc键兼容处理，使用$(document).keydown
* 2015/07/21
    1. 修改弹出时把body样式的overflow重置bug