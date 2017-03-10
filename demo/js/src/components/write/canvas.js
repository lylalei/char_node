var $ = require('jquery');
var Vue = require('../../../lib/vue');
var write = require('./writing');

module.exports = function(bus, styles, img) {
    Vue.component('v-canvas', {
        template : '<canvas :style="canvasStyle"> </canvas>',
        props : ['is_show'],
        data : function() {
            return {
                canvasStyle : {
                    display : this.is_show ? '' : 'none',
                    border : '5px solid red'
                }
            };
        },
        watch : {
            is_show : function() {
                this.canvasStyle.display = this.is_show ? '' : 'none';
                $(this.$el).transition('horizontal flip');
            }
        },
        mounted : function() {
            // 钩子
            var W = write(this.$el, img);
            bus.$on('clear', function (e) {
                W.clear();
            });
            bus.$on('cancel', function (e) {
                W.cancel();
            });
            bus.$on('char', function (e) {
                $.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    url: $CONFIG['getinfo'],
                    data: "zi=" + e,
                    success : function(msg) {
                        // var data = JSON.parse(msg);
                        var data = msg;
                        for(var key in data.POS) {
                            data.POS[key] = data.POS[key].split('/');
                            data.POS[key].pop();
                        }
                        W.getChar(data);
                        W.end();
                    },
                    jsonpCallback : 'sendData'
                });
            });
            bus.$on('start', function(e) {
                W.start();
                W.clear();
            });
        }
    });
};