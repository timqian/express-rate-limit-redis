# 这个库来自于一道面试题

用 Redis 和 Typescript 实现一个 RateLimit 限制器，可以指定事件、限制时间、限制次数，例如限制 1 分钟内最多 3 次获取短信验证码，或 10 分钟内最多一次重置密码。

可以实现为一个 express 的中间件。

## 期望的使用方法

一个 express 中间件, 可以挂在不同的 API 上用来限制一定时间内被特定用户调用得次数

### Install

```bash
npm i express-rate-limit-redis
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
  id: 'verify-phone-number',
  max: 3, // limit each IP to 3 requests per windowMs
  windowMs: 60 * 1000, // 1 minute
});

app.use('/verify-phone-number', limiter);

app.get('/verify-phone-number', (req, res) => {
  res.json({
    msg: 'ok',
  });
});

const limiter2 = RateLimiter({
  client,
  id: 'change-password',
  max: 1, // limit each IP to 1 requests per windowMs
  windowMs: 10 * 60 * 1000, // 10 minute
});

app.get('/change-password', limiter2, (req, res) => {
  res.json({
    msg: 'ok',
  });
});

const { PORT = 8080 } = process.env;
app.listen(PORT);
console.log(`server running on http://localhost:${PORT}`);
```

## 实现思路

以 IP (也可以换成其他用户传的参数) 做为 redis 上过期时间为 `windowMs` 的 key.
用户每访问一次这个 key 对应的 value 递增.
如果到达限制次数 `max`, 拒绝用户访问.

## 代码

[./src/index.js](./src/index.js)

## 一个使用实例

> [./example/server.js](./example/server.js)

1. Start example server
```bash
# install dependency
npm i
# ts to js
npm run build
# start example server
node example/server.js
```
2. 打开 `https://localhost:8080/verify-phone-number`
3. 刷新页面 3 次以后会被 rate limitd

> 使用了 [ioredis-mock](https://www.npmjs.com/package/ioredis-mock) 方便测试

## 可以做的更好

[TODO](./README.md#TODO)

## 参考资料

- [express-rate-limit](https://github.com/nfriedly/express-rate-limit/)
- [rate-limit-redis](https://github.com/wyattjoh/rate-limit-redis)
