import { Request, Response, NextFunction } from 'express';

interface Config {
  client: any;
  id?: string;
  windowMs: number;
  max: number;
}

function RateLimit({ client, id, windowMs, max }: Config) {

  async function rateLimit(req: Request, res: Response, next: NextFunction)  {
    const key = `${id ? id : ''}:${req.ip}`;

    // reply format from ioredis: [ [ null, 1 ], [ null, -1 ] ]
    const replies = await client.multi()
      .incr(key)
      .pttl(key)
      .exec();

    const hits = replies[0][1];
    let ttl = replies[1][1];

    // if the key is new or has no expiry, expire it after timeout
    if (hits === 1 || ttl === -1) {
      await client.pexpire(key, windowMs);
      ttl = windowMs;
    }

    // stop user from accessing the API
    if (hits > max) {
      return res.status(429).send('Too many requests, please try again later.');
    }

    next();
  }

  return rateLimit;
}

module.exports = RateLimit;
