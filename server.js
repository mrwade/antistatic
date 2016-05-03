const express = require('express');
const morgan = require('morgan');
const request = require('request');

const { BUCKET, NODE_ENV } = process.env;

const app = express();
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('*', (req, res) => {
  const { hostname, path } = req;
  const bucketPath = `http://s3.amazonaws.com/${BUCKET}/${hostname}${path}`;
  request(bucketPath).pipe(res);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
