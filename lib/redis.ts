import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!, // e.g. set UPSTASH_REDIS_REST_URL in your env
  token: process.env.UPSTASH_REDIS_REST_TOKEN!, // e.g. set UPSTASH_REDIS_REST_TOKEN in your env
});

export default redis;
