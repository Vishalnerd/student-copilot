import IORedis from "ioredis";

export const redis = new IORedis(process.env.REDIS_URL!);

export const redisConnection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("✅ Redis Connected");
});

redis.on("ready", () => {
  console.log("🚀 Redis Ready");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});