module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index');
  });
  app.use('/sendData', require('./sendData'));
};