require('../../../lib/vue');
var $ = require('jquery');
var data = require('./data');

var config = {
    curve : '1 order Bézier',
    gaoss : 1.3,//高斯初始值
    sigmoid : 3,//sigmoid初始值
    cos : 1,//余弦初始值
    acceleration : 0.5,
    minPress : 0.05,
    maxPress : 0.2,
    width : 50,
    density : 0.5,
    widthFunc : 'gaussian',
    
    ZI : '',
    currNum : 0,
    Num : 0,
    Name : [],
    POS : []
};

var clientWidth = $(document.body).outerWidth();
var widthCanvas = Math.min(Math.max(clientWidth, 450), 512);
var heightCanvas = widthCanvas;
var charAreaW = 390;
var charAreaH = charAreaW;

module.exports = function(canvas, img) {

    var $canvas = [];
    var ctx = null;

    // 方法集
    var funcObj = {
        pane : {
            // 虚线
            dl : function(context,x1,y1,x2,y2,dashLength){
                dashLength=dashLength===undefined?5:dashLength;
                var deltaX=x2-x1;
                var deltaY=y2-y1;
                var numDashes=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLength);
                for(var i=0;i<numDashes;++i){
                context[i%2===0?'moveTo':'lineTo']
                (x1+(deltaX/numDashes)*i,y1+(deltaY/numDashes)*i);
                }
                context.stroke();
            },

            //米字格以上 qt=======直接用qt(ctx)即可画出米字格
            qt : function(ctx) {
                ctx.beginPath();
                ctx.strokeStyle='black';
                ctx.lineWidth=1.5;
                ctx.moveTo(0,ctx.canvas.height/2);
                ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2);
                ctx.moveTo(ctx.canvas.width/2,0);
                ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height);
                ctx.stroke();
                ctx.lineWidth=0.5;
                funcObj.pane.dl(ctx,0,0,ctx.canvas.width,ctx.canvas.height,10);
                funcObj.pane.dl(ctx,0,ctx.canvas.height,ctx.canvas.width,0,10);
                ctx.closePath();
            },
            // 画板初始化
            start : function(canvas, ctx) {
                $('body').on('touchmove', function(evt) {
                    // 固定页面
                    evt.preventDefault();
                });
                var screencanvas = function() {
                    // 这里宽高固定死了
                    var clientWidth = $(document.body).outerWidth();
                    widthCanvas = Math.min(Math.max(clientWidth, 450), 512);
                    heightCanvas = widthCanvas;
                    canvas.width = widthCanvas;
                    canvas.height = heightCanvas;
                    funcObj.pane.qt(ctx);
                    funcObj.drawAllGetChar(config.POS, config.POS.length, ctx);
                };
                setTimeout(function() {
                    //cordova的莫名bug，不出米字格，无语死了
                    screencanvas();
                }, 500);
                $(window).resize(function() {
                screencanvas();
                });
            }
        },
        // 计算各种数值
        count : {
            distance : function(x1, y1, x2, y2) {
                // 距离
                return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
            },
            gaussian : function(v, gauss) {
            //高斯计算公式
            return ((1 / (Math.sqrt(2 * Math.PI) * gauss)) * Math.pow(Math.E,-(v * v) / (2 * gauss * gauss)));
            },
            gaussianPressure : function(opt, cur, pre) {
                var ratio = opt.maxPress / funcObj.count.gaussian(0, opt.gaoss);
                var speed = funcObj.count.gaussian(cur.speed, opt.gaoss);
                cur.pressure = Math.max(Math.min(ratio * speed, opt.maxPress), opt.minPress);
                cur.pressure = (cur.pressure + pre.pressure) / 2;
            },
            parameter : function(opt, cur, pre) {
            //剩余参数的计算函数
                cur.distance = funcObj.count.distance(cur.x, cur.y, pre.x, pre.y);
                var timeGap = cur.t - pre.t;
                cur.speed = timeGap ? cur.distance / timeGap : pre.speed;
                cur.speed = cur.speed * 0.6 + pre.speed * 0.4;
            },
            pushAll : function(opt, cur, pre) {
                //只提供x,y,time,lock自动计算所有参数，并全部压入
                if(!cur.l) {
                    cur.speed = 0;
                    cur.pressure = opt.maxPress;
                    cur.distance = 0;
                } else {
                    funcObj.count.parameter(opt, cur, pre);//速度计算函数，包括计算距离并且加入了距离的值
                    funcObj.count.gaussianPressure(opt, cur, pre);//速度计算函数，包括计算距离并且加入了距离的值
                }
            }
        },

        //书写一笔
        drawPoint : function(config, pre, cur) {
            var sampleNumber = parseInt(cur.distance / config.density);
  		    for ( var u = 0 ; u < sampleNumber ; u++ ) {
  		        var t = u / (sampleNumber - 1);
  		        var x = ( 1.0 - t ) * pre.x + t * cur.x;
  		        var y = ( 1.0 - t ) * pre.y + t * cur.y;
  		        var w = ( 1.0 - t ) * pre.pressure * config.width + t * cur.pressure * config.width;
  		        ctx.drawImage( img , x - w , y - w , w * 2 , w * 2 );
  		    }
  		},
        //书写整字
        drawAllPoint : function(config, data, count) {
            for(var r = 0;r <= count;r++) {
                if(data.l[r]) {
                    var sampleNumber = parseInt(data.distance[r] / config.density);
                    for(var u = 0;u < sampleNumber;u++){
                        var t = u / (sampleNumber - 1);
                        var x = (1.0 - t) * data.x[r - 1] + t * data.x[r];
                        var y = (1.0 - t) * data.y[r - 1] + t * data.y[r];
                        var w = (1.0 - t) * data.pressure[r - 1] * config.width + t * data.pressure[r] * config.width;
                        ctx.drawImage(img,x - w,y - w,w * 2,w * 2);
                    }
                }
            }
        },
        clearCanvas : function(ctx) {
  		//清除画板
  			ctx.clearRect(0,0,canvas.width,canvas.height);
            funcObj.pane.qt(ctx);
        },
        drawGetChar : function(data, ctx) {
            if(!data.length) {return ;}
            var x = data[0];
            var y = data[1];
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            for(var i = 2; i < data.length; i+=2) {
                var x = data[i];
                var y = data[i+1];
                ctx.lineTo(x, y);
            }
            ctx.fill();
        },
        drawAllGetChar : function(data, num, ctx) {
            for(var k = 0; k < num; k++) {
                this.drawGetChar(data[k], ctx);
            }
        },
        posFix : function(pos, posw, posh, w, h) {
            for(var i = 0; i < pos.length; i += 2) {
                var x = pos[i];
                var y = pos[i + 1];
                x = x / posw * w;
                y = y / posh * h;
                pos[i] = x;
                pos[i + 1] = y;
            }
        },
        posAllFix : function(pos, posw, posh, w, h) {
            for(var k in pos) {
                this.posFix(pos[k], posw, posh, w, h);
            }
        },
        posAllReduce : function(x, y, rule) {
            var len = x.length;
            var gap = len - rule;
            var dis = parseInt(len / gap) - 1;
            for(var i = 0; i < gap; i++) {
                x.splice(i * dis - i, 1);
                y.splice(i * dis - i, 1);
            }
        }
    };

    // 事件集
    var evtObj = {

        lock : false,
        mousedown : function(evt) {
            evtObj.lock = true;
            var info = {};
            var e = (evt.data && evt.data[0]) ? evt.touches[0] : evt;
            info.x = e.pageX - e.target.offsetLeft;
            info.y = e.pageY - e.target.offsetTop;
            info.t = new Date().getTime();
            info.l = false;
            funcObj.count.pushAll(config, info);
            data.push(info);
        },
        mousemove : function(evt) {
            if(evtObj.lock) {
                var e = (evt.data && evt.data[0]) ? evt.touches[0] : evt;
                var info = {};
                info.x = e.pageX - e.target.offsetLeft;
                info.y = e.pageY - e.target.offsetTop;
                info.t = new Date().getTime();
                info.l = true;
                funcObj.count.pushAll(config, info, data.getData());
                funcObj.drawPoint(config, data.getData(), info);
                data.push(info);
            }
        },
        mouseup : function(evt) {
            if(evtObj.lock) {
                var info = data.getArrData();
                var len = info.x.length;
                if(len > 200) {
                    funcObj.posAllReduce(info.x, info.y, 200);
                    len = info.x.length;
                }
                var xy = [];
                for(var i = 0; i < len; i++) {
                    xy.push(info.x[i]);
                    xy.push(info.y[i]);
                }
                funcObj.posAllFix(xy, widthCanvas, heightCanvas, charAreaW, charAreaH);
                $.ajax({
                    type: "GET",
                    url: "/sendData/getret",
                    data: "zi=" + config.ZI + "&no=" + config.currNum + "&xy=" + xy.join('/') + '/',
                    success : function(msg) {
                        if(parseInt(msg)) {
                            if(config.currNum >= config.Num) {return ;}
                            config.currNum++;
                            data.clear();
                            funcObj.clearCanvas(ctx);
                            funcObj.drawAllGetChar(config.POS, config.currNum, ctx);
                        } else {
                            if(config.currNum >= config.Num) {return ;}
                            data.clear();
                            funcObj.clearCanvas(ctx);
                            funcObj.drawAllGetChar(config.POS, config.currNum, ctx);
                        }
                    }
                });
            }
            evtObj.lock = false;
        }
    };

    // 绑定事件
    var bindEvt = function() {
        $canvas.on('mousedown', evtObj.mousedown);
        $canvas.on('mousemove', evtObj.mousemove);
        $canvas.on('mouseup', evtObj.mouseup);
        $canvas.on('mouseout', evtObj.mouseup);

        $canvas.on('touchstart', [1], evtObj.mousedown);
        $canvas.on('touchmove', [1], evtObj.mousemove);
        $canvas.on('touchend', evtObj.mouseup);
    };

    // 解析DOM
    var parseDOM = function() {
        ctx = canvas.getContext("2d");
        $canvas = $(canvas);
        funcObj.pane.start(canvas, ctx);
        data.init({
            'x' : 'arr', 
            'y' : 'arr', //x,y坐标
            't' : 'arr', //时间
            'l' : 'arr', //lock锁
            'speed' : 'arr', //速度
            'pressure' : 'arr', //压力
            'distance' : 'arr'//距离
        });//设置数据格式
    };

    // 初始化
    var init = function() {
        parseDOM();
    };

    init();

    var destroy = function() {
        $canvas.off('mousedown', evtObj.mousedown);
        $canvas.off('mousemove', evtObj.mousemove);
        $canvas.off('mouseup', evtObj.mouseup);
        $canvas.off('mouseout', evtObj.mouseout);

        $canvas.off('touchstart', evtObj.mousedown);
        $canvas.off('touchmove', evtObj.mousemove);
        $canvas.off('touchend', evtObj.mouseup);
    };

    var self = {
        clear : function() {
            funcObj.clearCanvas(ctx);
            data.clear();
            config.currNum = 0;
        },
        cancel : function() {
            funcObj.clearCanvas(ctx);
            data.clear();
            if(config.currNum == 0) {return ;}
            config.currNum--;
            funcObj.drawAllGetChar(config.POS, config.currNum, ctx);

            // data.cancel('l');
            // funcObj.clearCanvas(ctx);
            // funcObj.drawAllPoint(config, data.getArrData(), data.getCurLen());
        },
        getChar : function(char) {
            funcObj.clearCanvas(ctx);
            funcObj.posAllFix(char.POS, charAreaW, charAreaH, widthCanvas, heightCanvas);
            for(var key in char) {
                config[key] = char[key];
            }
            config.currNum = 0;
            funcObj.drawAllGetChar(char.POS, char.POS.length, ctx);
        },
        start : function() {
            bindEvt();
        },
        end : function() {
            destroy();
        }
    };
    return self;

};