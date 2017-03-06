
var btn = require('./components/button/btn');
var write = require('./components/write/canvas');
var Vue = require('../lib/vue');

// 总线，组件间的通信
var bus = new Vue();

btn(bus);
var image = new Image();
image.src = "../../img/model-black.png";//笔刷模型
// image.src = "./img/model-black.png";//笔刷模型
var styles = {};
write(bus, styles, image);

var app = new Vue({
    el : '#writing',
    data : {
        isShow : 'none',
        isbegin : true,
        beginClass : 'ui button',
        beginStyle : {
            width : '80%',
            height : '20%',
            position : 'absolute',
            top : '40%',
            left : '10%'
        },
        imgStyle : {
            height : '100%'
        }
    },
    methods : {
        begin : function(evt) {
            this.isbegin = false;
            this.isShow = '';
        }
    },
    mounted : function() {
        document.body.style.backgroundColor = 'RGB(246, 244, 235)';
    }
});
