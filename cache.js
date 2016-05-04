const lru = require('lru-cache');
const cache = lru({ max: 1000, maxAge: 1000 * 60 });
module.exports = cache;
