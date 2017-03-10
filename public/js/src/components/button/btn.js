var $ = require('jquery');
var Vue = require('../../../lib/vue');

var MAXNUM = 100;//最大页数
var INITNUM = parseInt(Math.random() * MAXNUM);//随机的初始化页数
var POS = 0;//汉子的游标
var commonBtn = 'medium  ui button';
var loadingBtn = 'medium  loading ui button';

module.exports = function(bus) {

    var charlist = function(page, that, pre) {
        if(pre) {
            swal({
                title: "请求列表",
                type : 'success',
                text: "正在获取列表汉字，请稍后。。。",
                timer: 1500,
                showConfirmButton: false
            }); 
        }
        $.ajax({
            type: "GET",
            data: "id=" + page,
            dataType: "jsonp",
            url: $CONFIG['getlist'],
            success : function(msg) {
                if(pre == 1) {
                    var tmp = msg.split('-');
                    that.chars = tmp.concat(that.chars);
                    POS = tmp.length - 1;//POS修正
                } else {
                    that.chars = that.chars.concat(msg.split('-'));
                }
                bus.$emit('char', that.chars[POS]);
                that.startText = '开始';
                that.preClass = commonBtn;
                that.nextClass = commonBtn;
                that.startClass = commonBtn;
            },
            jsonpCallback : 'sendData'
        });
    };

    Vue.component('v-button', {
        template : '\
            <div :id="root" :style="divStyle" >\
                <button type="button" :class="preClass" :style="buttonStyle" :num="pre" @click.stop="preCount"> 上一个 </button> \
                <button type="button" :class="startClass" :style="buttonStyle" @click="start" :id="startWrite"> {{startText}} </button> \
                <button type="button" :class="nextClass" :style="buttonStyle" :num="next" @click.stop="nextCount"> 下一个 </button> \
            </div> \
        ',
        props : ['is_show'],
        data : function() {
            var clientWidth = $(document.body).outerWidth();
            var clientHeight = $(document.body).outerHeight();
            var widthCanvas = clientHeight - 72 /*50位底部的按钮高度和22的上下padding*/< clientWidth ? clientHeight - 72 : clientWidth;
            return {
                root : 'btn_root',
                startWrite : 'startWrite',
                pages : 0,
                chars : [],
                next : INITNUM + 1,
                pre : INITNUM - 1,
                preClass : commonBtn,
                nextClass : commonBtn,
                startClass : commonBtn,
                startText : '开始',
                buttonStyle : {
                    width : '32%',
                    height : '50px'
                },
                divStyle : {
                    display : this.is_show ? '' : 'none',
                    minWidth : '400px',
                    maxWidth : widthCanvas + 'px'
                }
            };
        },
        watch : {
            is_show : function() {
                this.divStyle.display = this.is_show ? '' : 'none';
                $(this.$el).transition('horizontal flip');
            }
        },
        methods : {
            preCount : function(e) {
                this.preClass = loadingBtn;
                $(e.target).transition('pulse');
                if(--POS < 0) {
                    if(this.pre == -1) {
                        swal({
                            title: "警告",
                            type : 'warning',
                            text: "已经是第一个汉字了，请往下翻页！",
                            timer: 1500,
                            showConfirmButton: false
                        });
                        ++POS;
                        this.preClass = commonBtn;
                        return ;
                    }
                    charlist(this.pre--, this, 1);
                    return ;
                }
                bus.$emit('char', this.chars[POS]);
                this.preClass = commonBtn;
                this.startText = '开始';
            },
            nextCount : function(e) {
                this.nextClass = loadingBtn;
                $(e.target).transition('pulse');
                if(++POS >= this.chars.length) {
                    if(this.next > 100) {
                       swal({
                            title: "警告",
                            type : 'warning',
                            text: "已经是第一个汉字了，请往下翻页！",
                            timer: 1500,
                            showConfirmButton: false
                        }); 
                        --POS;
                        this.nextClass = commonBtn;
                        return ;
                    }
                    charlist(this.next++, this, 2);
                    return ;
                }
                bus.$emit('char', this.chars[POS]);
                this.nextClass = commonBtn;
                this.startText = '开始';
            },
            start : function(e) {
                if(this.startText == '已开始') {
                      $(e.target).transition('tada');
                      return ;
                }
                $(e.target).transition('pulse');
                bus.$emit('start', e);
                this.startText = '已开始';
            }
        },
        mounted : function() {
            charlist(INITNUM, this, 0);
        }
    });
};