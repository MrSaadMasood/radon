import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  EVICTION_POLICY: z.enum(["LFU", "LRU"]).catch("LRU"),
  STORE_CAPACITY: z.coerce.number().transform((val) => {
    return val === 0 ? 100 * 1000 : val
  }).default(100 * 1000),
  PORT: z.coerce.number().transform((val) => val === 0 ? 4772 : val).default(4772),
  BASE_URL: z.string().catch("http://localhost:4772"),
  BACKUP_TIME: z.coerce.number().catch(5 * 60 * 1000),
  CROSS_ORIGIN: z.string().url().optional()
});

export const { EVICTION_POLICY, STORE_CAPACITY, PORT, BASE_URL, BACKUP_TIME, CROSS_ORIGIN } = envSchema.parse(
  process.env,
);
