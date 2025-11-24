import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

(async () => {
  const result = await sql`SELECT NOW()`;
  console.log("Connected! Current time:", result[0].now);
})();
