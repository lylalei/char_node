var $ = require('jquery');
var Vue = require('../../../lib/vue');

module.exports = function(bus) {
    Vue.component('v-begin', {
        template : '\
            <div v-if="!is_show" :style="divStyle">\
                <img :src="beginIMG" :style="imgStyle"/>\
                <button @click="custShow" :style="beginStyle" :class="beginClass" >开始写字</button>\
                <p :style="textStyle" >北京语言大学 <br/>大数据与语言教育研究所</p>\
            </div>\
        ',
        props: ['is_show'],
        methods : {
            custShow : function(evt) {
                var that = this;
                $(that.$el).transition('horizontal flip');
                setTimeout(function() {
                    that.$emit('cust');
                }, 1000);
            }
        },
        data : function() {
            var clientWidth = $(document.body).outerWidth();
            var clientHeight = $(document.body).outerHeight();
            var widthCanvas = clientHeight < clientWidth ? clientHeight : clientWidth;
            return {
                divStyle : {
                    minWidth : '400px',
                    maxWidth : widthCanvas + 'px'
                },
                imgStyle : {
                    height : '60%',
                    width : '60%',
                    border : '5px solid red',
                    position : 'relative',
                    left : '20%',
                    marginTop : '3%'
                },
                beginStyle : {
                    width : '50%',
                    height : '20%',
                    position : 'relative',
                    left : '25%',
                    marginTop : '5%'
                },
                textStyle : {
                    marginTop : '5%',
                    textAlign : 'center'
                },
                beginClass : 'massive ui button',
                beginIMG : './img/3.png',
            };
        }
    });
};