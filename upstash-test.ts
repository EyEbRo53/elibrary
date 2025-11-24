import "dotenv/config";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function test() {
  try {
    await redis.set("test_key", "hello world");
    const value = await redis.get("test_key");
    console.log("✅ Redis working! Got:", value);
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
}

test();
