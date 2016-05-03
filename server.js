var express = require('express');
var morgan = require('morgan');
var request = require('request');

var app = express();
app.use(morgan('combined'));

app.get('*', function (req, res) {
  var bucketPath = [
    'http://s3.amazonaws.com/',
    process.env.BUCKET,
    '/',
    req.hostname,
    req.path
  ].join('');
  request(bucketPath).pipe(res);
});

var PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log('App listening on port ' + PORT);
});
