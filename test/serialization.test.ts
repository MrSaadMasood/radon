import fs from "fs/promises";
import path from "path";
import { describe, expect, it } from "vitest";
import { deserializer, serializer } from "../src/controllerHelpers";
import { LRUCache } from "../src/Classes/LRUCache";
import {
  cacheUseableNodes,
  cleanUpExpiredKeys,
  parseJsonFile,
} from "../src/utils/utils";

describe("tests the serialzation of InMemoryStore, min heap and the LRU / LFU Cache", () => {
  const filename = "testStore.json";
  const filePath = path.join(process.cwd(), filename);
  const toSerialize = {
    store: Array.from(
      new Map(
        Object.entries({
          one: { value: "value1" },
          two: { value: "value2", TTL: 5, timestamp: Date.now() - 2000 }, // has TTL and timestamp
          three: { value: "value3", TTL: 10, timestamp: Date.now() - 5000 }, // has TTL and timestamp
          four: { value: "value4" },
          five: { value: "value5", TTL: 7, timestamp: Date.now() - 3000 }, // has TTL and timestamp
          six: { value: "value6", TTL: 500, timestamp: Date.now() },
        }),
      ),
    ),

    heap: [
      { key: "two", TTL: 5 },
      { key: "three", TTL: 10 },
      { key: "five", TTL: 7 },
      { key: "six", TTL: 500 },
    ],

    cachedNodes: [
      { key: "one", type: "LFU", frequency: 1 },
      { key: "six", type: "LFU", frequency: 1 },
      { key: "four", type: "LFU", frequency: 2 },
      { key: "three", type: "LFU", frequency: 3 },
      { key: "five", type: "LFU", frequency: 4 },
      { key: "two", type: "LFU", frequency: 5 },
    ],
  };

  it("should correctly serialize, create .json file and parse the storedFile", async () => {
    await serializer(toSerialize, "testStore.json");

    expect(async () =>
      JSON.parse(await fs.readFile(filePath, "utf8")),
    ).not.throw();

    const parsed = JSON.parse(await fs.readFile(filePath, "utf8"));
    expect(parsed.store).toHaveLength(6);
    expect(parsed.heap).toHaveLength(4);
    expect(parsed.cachedNodes).toHaveLength(6);

    await deserializer(filename);
    fs.unlink(path.join(process.cwd(), filename));
  });

  it("should clean up expired keys successfully", () => {
    const { store, heap, cachedNodes } = toSerialize;
    const { storeAfterCleanup, useableHeap, cachedNodeWithExpiredKeysRemoved } =
      cleanUpExpiredKeys(new Map(store), heap, cachedNodes);
    expect(storeAfterCleanup.size).toBe(3);
    expect(useableHeap).toHaveLength(1);
    expect(cachedNodeWithExpiredKeysRemoved).toHaveLength(3);
    expect(cachedNodeWithExpiredKeysRemoved.length).toEqual(
      storeAfterCleanup.size,
    );
  });

  it("should add the cleanedUp nodes in the cache", () => {
    const { store, heap, cachedNodes } = toSerialize;
    const { cachedNodeWithExpiredKeysRemoved } = cleanUpExpiredKeys(
      new Map(store),
      heap,
      cachedNodes,
    );

    const lruCache = new LRUCache();
    cacheUseableNodes(cachedNodeWithExpiredKeysRemoved, lruCache);
    expect(lruCache.size()).toBe(3);
  });
});
