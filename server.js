var express = require('express');
var proxy = require('http-proxy-middleware');

var backendUri = process.env.BACKEND_URL || 'http://localhost:8888'
var port = process.env.WEB_PORT || 80;

// proxy middleware options
var proxy_options = {
    target: backendUri,
    pathRewrite: {
      '/backend': '/' // remove base path
    }
  }


var apiProxy = proxy(proxy_options);
var app = express();

var logger = (req, res, next) => {
    console.log(req.originalUrl);
    next();
}

app.use(express.static('webui/dist/webui'));

app.use('/backend/*', logger, apiProxy);

app.get('/*', logger);


app.listen(port, function () {
    console.log('Web server listening on port ' + port);
});