// src/lib/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

type RedisReply = boolean | number | string | Array<boolean | number | string>;

// Redis client – reads URL from env, falls back to localhost for dev
const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
  maxRetriesPerRequest: 1,
  lazyConnect: true,
  enableOfflineQueue: false,
});
redisClient.on('error', () => {
  // Gracefully suppress unhandled connection errors in dev when Redis is not running
});

export const rateLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) =>
      redisClient.call(args[0], ...args.slice(1)) as Promise<RedisReply>,
  }),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000, // 1 minute default
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  handler: (req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
  // Trusted‑proxy handling – only when enabled
  keyGenerator: (req) => {
    if (process.env.TRUSTED_PROXY === 'true' && req.headers['x-forwarded-for']) {
      const forwarded = Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for'];
      return (forwarded?.split(',')[0].trim() || req.ip || '') as string;
    }
    return req.ip || req.socket.remoteAddress || '';
  },
  // Override default error handling for Redis failures
  skipFailedRequests: true,
  passOnStoreError: true,
});
