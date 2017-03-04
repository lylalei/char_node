var express = require('express');
var router = express.Router();
var superagent = require('superagent');

// GET /sendData/getinfo 发送数据
router.get('/getinfo', function(req, res, next) {
    // 使用了superagent来发起请求
    // 查询本机ip，这里需要根据实际情况选择get还是post
    var url = 'http://localhost:8080/getinfo';
    superagent.get(url)
    .query(req.query)
    .pipe(res);
});

// GET /sendData/getlist 获得汉字列表
router.get('/getlist', function(req, res, next) {
    // 使用了superagent来发起请求
    // 查询本机ip，这里需要根据实际情况选择get还是post
    var url = 'http://127.0.0.1:8080/getlist';
    superagent.get(url)
    .query(req.query)
    .pipe(res);
});

// GET /sendData/getret 获得汉字评判
router.get('/getret', function(req, res, next) {
    // 使用了superagent来发起请求
    // 查询本机ip，这里需要根据实际情况选择get还是post
    var url = 'http://127.0.0.1:8080/getret';
    superagent.get(url)
    .query(req.query)
    .pipe(res);
});

module.exports = router;