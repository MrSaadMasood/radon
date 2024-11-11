import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  EVICTION_POLICY: z.enum(["LFU", "LRU"]).catch("LRU"),
  STORE_CAPACITY: z.coerce.number().transform((val) => {
    return val === 0 ? 100 * 1000 : val
  }),
  PORT: z.coerce.number().transform((val) => val === 0 ? 4772 : val),
  BASE_URL: z.string().catch("http://localhost:4772"),
  BACKUP_TIME: z.coerce.number().catch(1 * 30 * 1000)
});

export const { EVICTION_POLICY, STORE_CAPACITY, PORT, BASE_URL, BACKUP_TIME } = envSchema.parse(
  process.env,
);
