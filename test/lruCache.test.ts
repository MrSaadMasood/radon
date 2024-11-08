import { describe, expect, it } from "vitest";
import { LRUCache } from "../src/Classes/LRUCache"
import { MinHeap } from "../src/Classes/MinHeap";

describe("should test the lru cache management", () => {

  const inMemoryStore = new Map(Object.entries({
    one: { random: "value", timestamp: Date.now() },
    two: { random: "value", timestamp: Date.now() },
    three: { random: "value", timestamp: Date.now() },
    four: { random: "value", timestamp: Date.now() },
  }))
  const minHeap = new MinHeap()

  it("should correctly update the lru cache", () => {
    const lruCache = new LRUCache()

    const storeCapacity = 3
    lruCache.updateCache({ cacheItem: { key: "one", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    lruCache.updateCache({ cacheItem: { key: "two", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    lruCache.updateCache({ cacheItem: { key: "three", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })

    expect(lruCache.isCached("two")).toBe(1)
    expect(lruCache.isCached("three")).toBe(1)

    lruCache.updateCache({ cacheItem: { key: "four", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })

    expect(lruCache.isCached("one")).toBeFalsy()
    expect(lruCache.isCached("four")).toBe(1)
    expect(lruCache.size()).toBe(3)

    lruCache.updateCache({ cacheItem: { key: "four", type: "LRU", timestamp: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lruCache.size()).toBe(3)
    expect(lruCache.find("four")?.val.timestamp).toBe(1)

  })

  it("should delete the node from the cache", () => {

    const lruCache = new LRUCache()

    const storeCapacity = 3
    lruCache.updateCache({ cacheItem: { key: "one", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    lruCache.updateCache({ cacheItem: { key: "two", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    lruCache.updateCache({ cacheItem: { key: "three", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })

    const deleteCache = lruCache.deleteCache("one")

    expect(deleteCache).toBeTruthy()
    expect(deleteCache?.val.key).toBe("one")
    expect(lruCache.size()).toBe(2)


    lruCache.updateCache({ cacheItem: { key: "four", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    expect(lruCache.deleteCache("three")?.val.key).toBe("three")

    lruCache.deleteCache("four")
    lruCache.deleteCache("two")

    expect(lruCache.size()).toBe(0)

    const isCached = lruCache.deleteCache("two")

    expect(lruCache.size()).toBe(0)
    expect(isCached).toBeNull()

  })

  it("should get all the node values from the cache", () => {

    const lruCache = new LRUCache()

    const storeCapacity = 3
    lruCache.updateCache({ cacheItem: { key: "one", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    lruCache.updateCache({ cacheItem: { key: "two", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })
    lruCache.updateCache({ cacheItem: { key: "three", type: "LRU", timestamp: Date.now() }, storeCapacity, inMemoryStore, minHeap })

    expect(lruCache.getAllNodesValues()).toHaveLength(3)
  })
})
