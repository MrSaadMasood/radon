import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { MinHeap } from "../src/Classes/MinHeap";
import { LFUCache } from "../src/Classes/LFUCache";

describe(
  () => "test the min heap class functionality",
  () => {
    beforeAll(() => vi.useFakeTimers());
    afterAll(() => vi.useRealTimers());

    const lfuCache = new LFUCache();

    it("should store the values correctly in min heap ", () => {
      const minHeap = new MinHeap();
      minHeap.insert({ key: "random", TTL: 40 });
      minHeap.insert({ key: "random", TTL: 30 });
      minHeap.insert({ key: "random", TTL: 10 });
      minHeap.insert({ key: "random", TTL: 20 });

      expect(minHeap.readRootElemValue().TTL).toBe(10);

      minHeap.insert({ key: "random", TTL: 5 });

      expect(minHeap.readRootElemValue().TTL).toBe(5);
    });

    it("should clean up expired keys from the key value store", () => {
      let currRootElem;
      const keyValueStore = new Map(
        Object.entries({
          one: { value: "random", timestamp: Date.now() },
          two: { value: "random", timestamp: Date.now() },
          three: { value: "random", timestamp: Date.now() },
        }),
      );

      const minHeap = new MinHeap();
      minHeap.insert({ key: "one", TTL: 2 });
      minHeap.insert({ key: "two", TTL: 15 });
      minHeap.insert({ key: "three", TTL: 20 });

      vi.advanceTimersByTime(14);
      currRootElem = minHeap.cleanUpExpiredKeys(keyValueStore, lfuCache);
      expect(currRootElem).toBeDefined();
      expect(currRootElem.TTL).toBe(15);
      delete keyValueStore["one"];

      vi.advanceTimersByTime(4);
      currRootElem = minHeap.cleanUpExpiredKeys(keyValueStore, lfuCache);
      expect(currRootElem).toBeDefined();
      expect(currRootElem.TTL).toBe(20);
      delete keyValueStore["two"];

      vi.advanceTimersByTime(25);
      currRootElem = minHeap.cleanUpExpiredKeys(keyValueStore, lfuCache);
      expect(currRootElem).not.toBeDefined();
    });

    it("should successfully delete an elem from min heap and then heapify", () => {
      const minHeap = new MinHeap();
      minHeap.insert({ key: "one", TTL: 2 });
      minHeap.insert({ key: "two", TTL: 15 });
      minHeap.insert({ key: "three", TTL: 20 });
      minHeap.insert({ key: "four", TTL: 13 });

      minHeap.deleteFromMinHeapAndUpdateWithNewValue({ key: "four", TTL: 1 });
      expect(minHeap.readRootElemValue().TTL).toBe(1);
      minHeap.deleteFromMinHeapAndUpdateWithNewValue({ key: "four", TTL: 10 });
      expect(minHeap.readRootElemValue().TTL).toBe(2);
    });
  },
);
