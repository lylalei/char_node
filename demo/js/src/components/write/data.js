
var $ = require('jquery');

// 注意，这里先全局，用来调试,将来一定要把window去掉
var data = {};//数据集

module.exports = (function() {

    var funcObj = {
        // 测试数据数量的一致性
        consistent : function() {
            var max = 0;
            for(var k in data) {
                if($.isArray(data[k])) {
                    if(max == 0) {
                        max = data[k].length;
                    } else if(max == data[k].length) {
                        continue;
                    } else if(max != data[k].length) {
                        return false;
                    }
                }
            }
            return true;
        },
        // 获取数据数组的长度
        getLen : function() {
            for(var k in data) {
                if($.isArray(data[k])) {
                    return data[k].length;
                }
            }
            return 0;
        }
    };

    var that = {
        // 数据的清理
        clear : function(rule) {
            if($.isEmptyObject(data)) { throw ('data error!');}
            var hasObj = false, hasArr = true;
            if(rule) {
                hasObj = /obj|object/gi.test(rule);
                hasArr = /arr|array/gi.test(rule);
            } 
            for(var k in data) {
                if($.isArray(data[k]) && hasArr) {
                    data[k] = [];
                } else if($.isPlainObject(data[k]) && hasObj) {
                    data[k] = {};
                } 
            }
        },
        //压入数据，并检测数组长度的一致性
        push : function(opt) {
            if($.isEmptyObject(data)) { throw ('data error!');}
            var tmp = {};
            for(var k in opt) {
                if(k in data && $.isArray(data[k])) {
                    tmp[k] = data[k];
                    $.merge(data[k], [].concat(opt[k]));//大坑，jquery合并数组竟然两个参数都必须是数组
                } else if(k in data && $.isPlainObject(data[k])) {
                    $.extend(data[k], opt[k]);
                } 
            }
            // 验证数据的一致性
            if(funcObj.consistent()) {
                tmp = null;
            } else if(!$.isEmptyObject(tmp)) {
                for(var k in tmp) {
                    if($.isArray(data[k])) {
                        data[k] = tmp[k];
                    }
                }
                tmp = null;
                throw('data no consistent!');
            }
        },
        // 获取单个数据
        getData : function() {
            if(!arguments.length) {
                var result = {};
                var pos = funcObj.getLen() - 1;
                for(var key in data) {
                    if($.isArray(data[key])) {
                        result[key] = data[key][pos];
                    }
                }
                return result;
            }
            var result = [];
            var dataLen = funcObj.getLen();
            for(var k in arguments) {
                var pos = arguments[k];
                if(!$.isNumeric(pos)) {throw 'data pos is not number!';}
                if(pos >= dataLen || pos < 0) {throw 'data pos is overflow';}
                var aData = {};
                for(var key in data) {
                    if($.isArray(data[key])) {
                        aData[key] = data[key][pos];
                    }
                }
                result.push(aData);
            }
            return result;
        },
        // 获取当前data数组长度
        getCurLen : function() {
            var len = funcObj.getLen();
            return  len ? len - 1 : 0;
        },
        // 撤销一笔,以哪个属性为准rule
        cancel : function(rule) {
            if($.isEmptyObject(data)) { return ;}
            var tmp = {};
            for(var len = funcObj.getLen() - 1; data[rule][len]; len--) {
                for(var k in data) {
                    if(!$.isArray(data[k])) {
                        continue;
                    }
                    tmp[k] = [];
                    tmp[k].unshift(data[k].pop());
                }
            }
            for(var k in data) {
                if(!$.isArray(data[k])) {
                    continue;
                }
                tmp[k] = [];
                tmp[k].unshift(data[k].pop());
            }
            if(!funcObj.consistent()) {
                for(var k in tmp) {
                    if($.isArray(data[k])) {
                        $.merge(data[k], tmp[k]);
                    }
                }
                console.log('data is no consistent!');
            }
            tmp = null;
        },
        // 获得数组数据
        getArrData : function() {
            var result = {};
            for(var k in data) {
                if($.isArray(data[k])) {
                    result[k] = [].concat(data[k]);
                }
            }
            return result;
        },
        // 格式化数据
        formatData : function() {

        },
        // 数据的格式化
        init : function(opt) {
            if($.isPlainObject(opt) && !$.isEmptyObject(opt)) {
                for(var k in opt) {
                    switch (opt[k]) {
                        case 'array' : case 'arr' : data[k] = []; break;
                        case 'object' : case 'obj' : data[k] = {}; break;
                        default : data = {}; throw ('data error!'); 
                    }
                }
                return true;
            } 
            data = {};
            throw ('data error!');
        }
    };

    return that;
}());