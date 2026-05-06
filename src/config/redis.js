import Redis from "ioredis"

const redisClient = new Redis({
    host :process.env.REDIS_HOST,
    port:Number(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASS,
});

redisClient.on("connect",()=>{
    console.log("Redis connected!!")
});

redisClient.on("error",(err)=>{
    console.log("Redis error:", err.message)
});

export default redisClient;