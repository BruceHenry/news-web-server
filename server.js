var express = require('express');

var server = express();

var port = process.env.WEB_PORT || 8000;

server.use(express.static('assets'));

server.get('/*', function (req, res, next) {
    console.log(req.originalUrl);
    next();
});

server.get('/articles/*', function (req, res, next) {
    var article_list = [{1:1}, {2:2}, {3:3}];
    res.send(article_list);
});

server.listen(port, function () {
    console.log('Web server listening on port ' + port);
  });