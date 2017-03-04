
var btn = require('./components/button/btn');
var write = require('./components/write/canvas');
var Vue = require('../lib/vue');

// 总线，组件间的通信
var bus = new Vue();

btn(bus);
var image = new Image();
image.src = "../../img/model-black.png";//笔刷模型
var styles = {};
write(bus, styles, image);

var app = new Vue({
    el : '#writing',
});
