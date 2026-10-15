// pages/api/enquiry.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

// Redis client – reads URL from env, falls back to localhost for dev
const redisClient = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

// Configure the limiter
const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: ((...args: string[]) => redisClient.call(args[0], ...args.slice(1))) as any,
  }),
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000, // 1 minute default
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  handler: (_req, res) => {
    res.status(429).json({ error: 'Too many requests, please try again later.' });
  },
  keyGenerator: (req) => {
    if (process.env.TRUSTED_PROXY === 'true' && req.headers['x-forwarded-for']) {
      const forwarded = Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for'];
      return (forwarded?.split(',')[0].trim() || req.socket.remoteAddress || '') as string;
    }
    return (req.socket.remoteAddress || '') as string;
  },
  skipFailedRequests: true,
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply the limiter, then handle the request.
  (limiter as any)(req, res, () => {
    // TODO: integrate with Payload Enquiry creation logic.
    // For now, just acknowledge receipt.
    res.status(200).json({ message: 'Enquiry received' });
  });
}
