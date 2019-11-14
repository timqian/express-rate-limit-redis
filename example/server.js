const express = require('express');
const app = express();
const RateLimiter = require('../dist/index');
const Redis = require('ioredis-mock');
const client = new Redis();

const limiter = RateLimiter({
  client, // redis client
  max: 3, // limit each IP to 3 requests per windowMs
  windowMs: 60 * 1000, // 1 minute
});

app.use('/', limiter);

app.get('/', (req, res) => {
  res.json({
    msg: 'ok',
  });
});

const { PORT = 8080 } = process.env;

app.listen(PORT);

console.log(`server running on http://localhost:${PORT}`);
