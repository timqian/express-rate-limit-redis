# express-rate-limit-redis

An express rate-limiting middleware using redis as its storage

## Requirements

- Express > v4
- Redis > v2.6.12
- ioredis > v4 or ioredis-mock > v4

## Install

```bash
npm i express-rate-limit-redis
```

## Usage

```js
const express = require('express');
const app = express();
const RateLimiter = require('express-rate-limit-redis');
const Redis = require('ioredis');
const client = new Redis();

const limiter = RateLimiter({
  client,
  max: 3 // limit each IP to 3 requests per windowMs
  windowMs: 60 * 1000, // 1 minute
});

app.use('/verify-phone-number', limiter);

app.get('/verify-phone-number', (req, res) => {
  res.json({
    msg: 'ok',
  });
});
```

## Example

> [./example/server.js](./example/server.js)

1. Start example server
```bash
# install dependency
npm i
# ts to js
npm run build
# start example server
node example/server.jss
```
2. Navigate to `localhost:8080`
3. Refresh the page for 3 times, you will find you are rate limited

## Configuration options

### max

Max number of connections during windowMs milliseconds before sending a 429 response.

### windowMs

How long in milliseconds to keep records of requests in memory.

## TODO

- [ ] rate limit based not only on `req.ip`, but on params of `req`
- [ ] skip/whitelist requests
- [ ] customize statusCode
- [ ] header denoting request limit (X-RateLimit-Limit) and current usage (X-RateLimit-Remaining)
- [ ] add test
- [ ] ts lint

## Thanks

- [express-rate-limit](https://github.com/nfriedly/express-rate-limit/)
- [rate-limit-redis](https://github.com/wyattjoh/rate-limit-redis)
- [ioredis-mock)](https://github.com/stipsan/ioredis-mock)
- [node.green](https://node.green/)
- [30-second-guide-to-publishing-a-typescript-package-to-npm](https://medium.com/cameron-nokes/the-30-second-guide-to-publishing-a-typescript-package-to-npm-89d93ff7bccd)