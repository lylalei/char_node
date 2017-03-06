var $ = require('jquery');
var Vue = require('../../../lib/vue');

module.exports = function(bus) {
    Vue.component('v-button', {
        template : '\
            <div :id="root" :style="{display : is_show}">\
                <button type="button" :class="button" :style="buttonStyle" :num="pre" @click.stop="preCount"> 上一个 </button> \
                <button type="button" :class="button" :style="buttonStyle" :page="pages" @click="getList"> 获取列表 </button> \
                <button type="button" :class="button" :style="buttonStyle" @click="start"> 开始 </button> \
                <button type="button" :class="button" :style="buttonStyle" :num="next" @click.stop="nextCount"> 下一个 </button> \
            </div> \
        ',
        props : ['is_show'],
        data : function() {
            return {
                root : 'btn_root',
                pages : 0,
                chars : [],
                next : 1,
                pre : -1,
                button : 'ui button',
                buttonStyle : {
                    width : '23%',
                    height : '100px'
                },
                btnStyle : {
                    display : 'none'
                },
                classes : function(key) {
                    return key == this.next - 1 ? 'red' : 'black';
                }
            };
        },
        methods : {
            preCount : function() {
                if(this.pre == -1) {
                    return ;
                }
                this.next--;
                this.pre--;
                bus.$emit('char', this.chars[this.next - 1]);
            },
            nextCount : function() {
                if(this.next >= this.chars.length) {
                    return ;
                }
                this.pre++;
                this.next++;
                bus.$emit('char', this.chars[this.next - 1]);
            },
            start : function(e) {
                bus.$emit('start', e);
            },
            getList : function(e) {
                var that = this;
                that.next = 1;
                that.pre = -1;
                $.ajax({
                    type: "GET",
                    data: "id=" + (++this.pages),
                    url: "/sendData/getlist",
                    success : function(msg) {
                        that.chars = [];//一个大坑，这里不来一下，view不更新
                        $.merge(that.chars, msg.split('-'));
                        bus.$emit('char', that.chars[that.next - 1]);
                    }
                });
            }
        },
        mounted : function() {
            var that = this;
            $.ajax({
                type: "GET",
                data: "id=0",
                url: "/sendData/getlist",
                success : function(msg) {
                    that.chars = [];//一个大坑，这里不来一下，view不更新
                    $.merge(that.chars, msg.split('-'));
                    bus.$emit('char', that.chars[that.next - 1]);
                }
            });            
        }
    });
};