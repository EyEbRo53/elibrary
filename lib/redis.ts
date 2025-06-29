import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "",
  token: process.env.REDIS_TOKEN,
});

export default redis;
