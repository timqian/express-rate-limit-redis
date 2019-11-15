const express = require('express');
const app = express();
const RateLimiter = require('../dist/index');
const Redis = require('ioredis-mock');
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
  max: 1, // limit each IP to 3 requests per windowMs
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
