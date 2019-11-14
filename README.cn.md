# 这个库来自于一道面试题

用 Redis 和 Typescript 实现一个 RateLimit 限制器，可以指定事件、限制时间、限制次数，例如限制 1 分钟内最多 3 次获取短信验证码，或 10 分钟内最多一次重置密码。

可以实现为一个 express 的中间件。

## 期望的 Usage

一个 express 中间件, 可以在不同的 API 上(指定事件)挂上这个中间件来做限制时间内调用次数的限制

### Install

```bash
npm i express express-rate-limit-redis ioredis
```

### Server code

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

## 实现思路

以 IP (也可以换成其他用户传的参数) 做为 redis 上过期时间为 `windowMs` 的 key.
用户每访问一次这个 key 对应的 value 递增.
如果到达限制次数 `max`, 拒绝用户访问.

## 代码

[./src/index.js](./src/index.js)

## [跑一个例子](./README.md#example)

## [可以做的更好](./README.md#TODO)
