var $ = require('jquery');
var Vue = require('../../../lib/vue');

var isMobile = navigator.userAgent.indexOf('Mobile') > -1 ? true : false;
module.exports = function(bus) {

    Vue.component('v-result', {
        template : '\
            <div v-if="is_show==4" :style="divStyle">\
                <div :style="resultDivPre"><p :style="pStyle">用时：</p><span>{{result.totalTime}}</span></div>\
                <div :style="resultDivAft"><p :style="pStyle">得分：</p><span>{{score}}</span></div>\
                <div><p :style="tipStyle">扫码关注公众号<br />定制汉字书写列表</p><img src="./img/qrcode.jpg" :style="imgStyle"></div>\
            </div>',
        props : ['is_show'],
        data : function() {
            var clientWidth = $(document.body).outerWidth();    
            var clientHeight = $(document.body).outerHeight();
            var widthCanvas = clientHeight < clientWidth ? clientHeight : clientWidth;
            return {
                score : 100,
                divStyle : {
                    border : '5px solid red',
                    height : '100%',
                    minWidth : '455px',
                    maxWidth : widthCanvas + 'px',
                    margin : '0 auto'
                },
                resultDivPre : {
                    margin : 'auto auto',
                    width : '40%',
                    height : '50px',
                    border : '5px red solid',
                    borderRadius : '0.28571429rem',
                    marginTop: '70px'
                },
                resultDivAft : {
                    margin : 'auto auto',
                    width : '40%',
                    height : '50px',
                    border : '5px red solid',
                    borderRadius : '0.28571429rem',
                    marginTop: '10px'
                },
                pStyle : {
                    backgroundColor: 'red',
                    height: '100%',
                    fontSize: '1.6em',
                    fontFamily: '华文行楷',
                    width: '40%',
                    textAlign: 'right',
                    display: 'inline-block'
                },
                imgStyle : {
                    width: isMobile ? '40%' : '130px',
                    margin: 'auto',
                    display: 'block'
                },
                tipStyle : {
                    textAlign: 'center',
                    marginTop: isMobile ? '70px' : '20px',
                    fontFamily: '华文行楷',
                    fontSize: '3em'
                },
                result : RES,
            };
        },
        watch : {
            is_show : function() {
                var that = this;
                if(that.is_show == 4) {
                    $.ajax({
                        type: "GET",
                        url: $CONFIG['getscore'],
                        dataType: "jsonp",
                        data: "info=" + RES.sendData.join('-'),
                        jsonpCallback : 'sendData',
                        success : function(msg) {
                            that.score = msg;
                        }
                    });
                }
            }
        }
    });
};