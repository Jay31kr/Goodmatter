import slidingWindowLimiter from "./slidingWindowLimiter.js";

//Global Limiter

const globalLimiter = slidingWindowLimiter({
    windowMs:  60 * 1000,
    max:3,
    keyFn: (req)=>`rq:global:${req.ip}`,
    message:{
        success:false,
        error: 'Too many requests from this IP. Try again shortly.',
    }
});


export {
    globalLimiter
}