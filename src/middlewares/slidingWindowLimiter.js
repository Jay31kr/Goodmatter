import redisClient from "../config/redis.js";
import { ApiError } from "../utils/apiError.js";

const slidingWindowLimiter = ({
    windowMs,
    max,
    keyFn,
    message = ''
}) => {
    return async (req, res, next) => {
        try {

            //key genrate
            const key = keyFn(req);

            const now = Date.now();
            const windowStart = now - windowMs;

            const pipeline = redisClient.pipeline();

            //remove old request
            pipeline.zremrangebyscore(key, 0, windowStart);

            //add current request timestmp 
            pipeline.zadd(key, now, `${now}-${Math.random()}`);

            //count request inside window
            pipeline.zcard(key);

            //auto delete key latter
            pipeline.expire(key, Math.ceil(windowMs / 1000));

            const results = await pipeline.exec();

            const requestCount = results[2][1];

            res.setHeader(
                "X-RateLimit-Remaining",
                Math.max(0, max - requestCount)
            );

            res.setHeader(
                "X-RateLimit-Window-Ms",
                windowMs
            );

            if (requestCount > max) {
                return next(
                    new ApiError(
                        429,
                        message?.error || "Too many requests"
                    )
                );
            }
            next();
        } catch (error) {
            console.log(`rate limiter error : ${error}`);
            createContext(new ApiError(
                500,
                "Ratelimitter flow error"
            ))
        }
    }
}

export default slidingWindowLimiter;
