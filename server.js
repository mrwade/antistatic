const express = require('express');
const morgan = require('morgan');
const request = require('request');

const { BUCKET, NODE_ENV } = process.env;

const app = express();
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

const getHeaders = (req, keys) => {
  let headers = {};
  keys.forEach(key => {
    const val = req.get(key);
    if (val) headers[key] = val;
  });
  return headers;
};

app.get('*', (req, res) => {
  const { hostname, path } = req;
  const bucketPath = `http://s3.amazonaws.com/${BUCKET}/${hostname}${path}`;
  const headers = getHeaders(req, ['If-None-Match']);
  request({ url: bucketPath, headers }).pipe(res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
