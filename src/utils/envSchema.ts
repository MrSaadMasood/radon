import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  EVICTION_POLICY: z.enum(["LFU", "LRU"]).default("LRU"),
  STORE_CAPACITY: z.coerce.number().default(100 * 100000),
  PORT: z.coerce.number().default(4772),
  BASE_URL: z.string().default("http:\\localhost:4772"),
  BACKUP_TIME: z.coerce.number().default(5 * 60 * 1000)
});

export const { EVICTION_POLICY, STORE_CAPACITY, PORT, BASE_URL, BACKUP_TIME } = envSchema.parse(
  process.env,
);
