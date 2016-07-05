const express = require('express');
const morgan = require('morgan');
const request = require('request');
const cache = require('./cache');
const {
  resolve,
  resolveHealthCheck,
  resolveWwwRedirect,
  resolveCached,
  resolveExactPath,
  resolveIndexPath,
  resolveNotFound
} = require('./resolvers');

const { NODE_ENV } = process.env;
const app = express();

app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('*', (req, res) => {
  resolve(req, [
    resolveHealthCheck,
    resolveWwwRedirect,
    resolveCached,
    resolveExactPath,
    resolveIndexPath,
    resolveNotFound
  ]).then(({ status, headers, body }) => {
    res.status(status).set(headers).send(body);
    if (NODE_ENV !== 'production') console.log('Cache: ', cache.dump());
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
