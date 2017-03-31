import btn from './components/button/btn';
import write from './components/write/canvas';
import begin from './components/begin/begin';
import Vue from '../lib/vue';
import $ from 'jquery';
window.jQuery = $;//为了使用semantic
require('../lib/semantic');


var app = new Vue({
    el : '#writing',
    data : {
        isShow : false
    },
    methods : {
        custShowFunc : function() {
            this.isShow = !this.isShow;
        }
    },
    mounted : function() {
        document.body.style.backgroundColor = 'RGB(246, 244, 235)';
    },
    beforeCreate : function() {
        // 总线，组件间的通信
        var bus = new Vue();
        begin();
        btn(bus);
        var image = new Image();
        // image.src = "../../img/model-black.png";//笔刷模型
        image.src = "./img/model-black.png";//笔刷模型
        var styles = {};
        write(bus, styles, image);
    }
});
