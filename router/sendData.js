var express = require('express');
var router = express.Router();
var superagent = require('superagent');
var config = require('config-lite');

// GET /sendData/getinfo 发送数据
router.get('/getinfo', function(req, res, next) {
    // 使用了superagent来发起请求
    // 查询本机ip，这里需要根据实际情况选择get还是post
    var url = 'http://localhost:'+config['removePort']+'/getinfo';
    superagent.get(url)
    .query(req.query)
    .end(function(err, resource) {
        // res.send('sendData(' + resource.text + ')');
        res.send(resource.text);
    });
    // .pipe(res);
});

// GET /sendData/getlist 获得汉字列表
router.get('/getlist', function(req, res, next) {
    // 使用了superagent来发起请求
    // 查询本机ip，这里需要根据实际情况选择get还是post
    var url = 'http://127.0.0.1:'+config['removePort']+'/getlist';
    superagent.get(url)
    .query(req.query)
    .end(function(err, resource) {
        // res.send('sendData("' + resource.text + '")');
        res.send(resource.text);
    });
    // .pipe(res);
});

// GET /sendData/getret 获得汉字评判
router.get('/getret', function(req, res, next) {
    // 使用了superagent来发起请求
    // 查询本机ip，这里需要根据实际情况选择get还是post
    var url = 'http://127.0.0.1:'+config['removePort']+'/getret';
    superagent.get(url)
    .query(req.query)
    .end(function(err, resource) {
        // res.send('sendData("' + resource.text + '")');
        res.send(resource.text);
    });
    // .pipe(res);
});

module.exports = router;