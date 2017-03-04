var express = require('express');
var path = require('path');
var router = require('./router');
var config = require('config-lite');
var app = new express();

// 设置静态文件
app.use(express.static(path.join(__dirname, 'public')));
// 设置模板文件和模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 设置模板全局常量
app.locals = config;

// 路由处理
router(app);

app.listen(config.port, function(){
    console.log('ok!');
});