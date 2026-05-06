import slidingWindowLimiter from "./slidingWindowLimiter.js";

//Global Limiter

const globalLimiter = slidingWindowLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
    keyFn: (req) => `rl:global:${req.ip}`,
    message: {
        success: false,
        error: 'Too many requests from this IP. Try again shortly.',
    }
});

const authLimiter = slidingWindowLimiter({
    windowMs: 60 * 60 * 1000,
    max: 5,
    keyFn: (req) => `rl:auth:${req.ip}`,
    message: {
        success: false,
        error: 'Too many requests from this IP. Try again afetr 1 hour.',
    }
});

const refreshLimiter = slidingWindowLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    keyFn: (req) => `rl:refresh:${req.user.id}`,
    message: {
        success: false,
        error: "Too Many request, try after some time"
    }
});

const otpLimiter = slidingWindowLimiter({
    windowMs: 10 * 60 * 1000,
    max: 3,
    keyFn: (req) => `rl:otp:${req.ip}`,
    message: {
        success: false,
        error: "Too Many request, try after 10 mins"
    }
});

const perUserLimiter = slidingWindowLimiter({
    windoMs: 15 * 60 * 1000,
    max: 200,
    keyFn: (req) => `rl:user:${req.user._id}`,
    message: {
        success: false,
        error: 'You are making too many requests. Slow down.',
    },
});

const pitchDeckLimiter = slidingWindowLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  keyFn: (req) => `rl:pitchdeck:${req.user.id}`,
  message: {
    success: false,
    error: 'Pitch deck operation limit reached. Try again after 1 hour.',
  },
});

const sendInterestLimiter = slidingWindowLimiter({
  windowMs: 12 * 60 * 60 * 1000, // 24 hours
  max: 20,
  keyFn: (req) => `rl:interest:${req.user.id}`,
  message: {
    success: false,
    error: 'Daily interest limit reached. You can send up to 20 per day.',
  },
});

export {
    globalLimiter,
    authLimiter,
    refreshLimiter,
    otpLimiter,
    perUserLimiter,
    pitchDeckLimiter,
    sendInterestLimiter
}