import express, { Request, Response } from "express";
import { z } from "zod";
import morgan from "morgan"
import helmet from "helmet"
import {
  addKeyValueToStore,
  deleteKeyFromStore,
  deserializer,
  getValueFromStore,
  periodicallySerializeData,
  removeExpiredKeysFromHeap,
} from "./controllerHelpers.js";
import { BACKUP_TIME, PORT } from "./utils/envSchema.js";

const STORE_FILE = "store.json";
const keyParamsSchema = z.object({ key: z.string() });

const app = express();
app.use(morgan("short"))
app.use(helmet())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/get/:key", async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const { key } = keyParamsSchema.parse(params);
    const value = await getValueFromStore(key);
    if (!value) res.status(404).json("Value Not Found");
    res.json(value);
  } catch (error) {
    console.log("error occured while getting the value", error);
    res.status(422).json("Key must be a string");
  }
});

app.post("/set", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { key, value, ttl } = z
      .object({
        key: z.string(),
        value: z.any(),
        ttl: z.string().or(z.number()).optional(),
      })
      .parse(body);
    const added = await addKeyValueToStore(key, value, ttl);
    if (!added) throw new Error();
    res.json(`${key} Added Successfully`);
  } catch (error) {
    console.log("error occured while setting the value", error);
    res.status(400).json("Failed To Add Key");
  }
});

app.delete("/del/:key", async (req: Request, res: Response) => {
  try {
    const params = req.params;
    const { key } = keyParamsSchema.parse(params);
    await deleteKeyFromStore(key);
    res.json(`Deleted Key: ${key}`);
  } catch (error) {
    console.log("error occured while deleting the value", error);
    res.status(422).json("Key must be a string");
  }
});

app.get("/ping", (_: Request, res: Response) => {
  res.json("pong");
});

app.use((_, res: Response) => {
  res.status(500).json("Internal Server Error");
});

deserializer(STORE_FILE)
  .then(() => {
    periodicallySerializeData(BACKUP_TIME, STORE_FILE);
    removeExpiredKeysFromHeap();
    app.listen(PORT, () => console.log("server running on port", PORT));
  })
  .catch((error) => {
    console.log("deserialization step failed", error);
  });
