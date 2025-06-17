import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

// Rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Rate limiter for public APIs
export const publicApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Rate limiter for internal APIs
export const internalApiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many internal API requests',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Rate limiter for chat endpoints
export const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 messages per minute
  message: 'Too many chat messages',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
});

// Rate limiter for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Too many file uploads',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later',
      retryAfter: res.getHeader('Retry-After'),
    });
  },
}); 