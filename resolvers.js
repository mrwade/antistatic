const request = require('request');
const _ = require('underscore');
const cache = require('./cache');

const { BUCKET } = process.env;

const getHeaders = (req, keys) => {
  let headers = {};
  keys.forEach(key => {
    const val = req.get(key);
    if (val) headers[key] = val;
  });
  return headers;
};

const getPath = req => `/${req.hostname}${req.path}`;
const getUrl = req => `http://s3.amazonaws.com/${BUCKET}${getPath(req)}`;

const resolveNext = (promise, resolvers, args) => {
  return promise.then(result => {
    if (!result) {
      return resolveNext(resolvers[0](...args), _.tail(resolvers), args);
    }
    return result;
  });
}

const resolve = (req, resolvers) => {
  return resolveNext(Promise.resolve(false), resolvers, [req]);
};

const resolveCached = req => new Promise((resolve, reject) => {
  const path = getPath(req);
  const cached = cache.get(path);

  if (cached && cached.etag && req.get('If-None-Match') == cached.etag) {
    resolve({ status: 304 });
  }
  resolve();
});

const resolveUrlPath = ({ cachePath, url, req }) => new Promise((resolve, reject) => {
  const headers = getHeaders(req, ['If-None-Match']);
  request({ url, headers }, (err, response, body) => {
    const { statusCode } = response;
    if (statusCode != 403 && statusCode != 404) {
      const { etag } = response.headers;
      cache.set(cachePath, { status: statusCode, etag });
      return resolve({
        status: statusCode,
        headers: { etag, 'content-type': response.headers['content-type'] },
        body
      });
    }
    resolve();
  });
});

const resolveExactPath = req => resolveUrlPath({
  cachePath: getPath(req),
  url: getUrl(req),
  req
});

const trimTrailingSlash = url =>
  url.match(/\/$/) ? url.substring(0, url.length-1) : url;

const resolveIndexPath = req => resolveUrlPath({
  cachePath: getPath(req),
  url: `${trimTrailingSlash(getUrl(req))}/index.html`,
  req
});

const resolveNotFound = req => new Promise((resolve, reject) => {
  resolve({ status: 404 });
});

module.exports = {
  resolve,
  resolveCached,
  resolveExactPath,
  resolveIndexPath,
  resolveNotFound
};
