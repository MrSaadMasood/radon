import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  EVICTION_POLICY: z.enum(["LFU", "LRU"]).default("LRU"),
  STORE_CAPACITY: z.coerce.number().default(1000),
  PORT: z.coerce.number().default(4772),
  BASE_URL: z.string().default("http:\\localhost:4772")
});

export const { EVICTION_POLICY, STORE_CAPACITY, PORT, BASE_URL } = envSchema.parse(
  process.env,
);
