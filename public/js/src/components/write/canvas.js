var $ = require('jquery');
var Vue = require('../../../lib/vue');
var write = require('./writing');

module.exports = function(bus, styles, img) {
    Vue.component('v-canvas', {
        template : '<canvas :style="{display : is_show}"> </canvas>',
        props : ['is_show'],
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
                    url: "/sendData/getinfo",
                    data: "zi=" + e,
                    success : function(msg) {
                        var data = JSON.parse(msg);
                        for(var key in data.POS) {
                            data.POS[key] = data.POS[key].split('/');
                            data.POS[key].pop();
                        }
                        W.getChar(data);
                        W.end();
                    }
                });
            });
            bus.$on('start', function(e) {
                W.start();
                W.clear();
            });
        }
    });
};