import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

const envSchema = z.object({
  EVICTION_POLICY: z.enum(["LFU", "LRU"])
})


export const {
  EVICTION_POLICY,
} = envSchema.parse(process.env)


