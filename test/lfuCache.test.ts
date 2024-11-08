import { describe, expect, it } from "vitest"
import { LFUCache } from "../src/Classes/LFUCache"
import { MinHeap } from "../src/Classes/MinHeap"

describe('should test the functionality of LFU caching and eviction mechanism', () => {

  const inMemoryStore = new Map(Object.entries({
    one: { random: "value", timestamp: Date.now() },
    two: { random: "value", timestamp: Date.now() },
    three: { random: "value", timestamp: Date.now() },
    four: { random: "value", timestamp: Date.now() },
  }))
  const minHeap = new MinHeap()
  const storeCapacity = 4

  it("should single node insertion and frequency updation", () => {
    const lfuCache = new LFUCache()

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    expect(lfuCache.isCached("one")).toBe(1)
    expect(lfuCache.find("one")?.val.frequency).toBe(1)

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    expect(lfuCache.isCached("one")).toBe(2)
    expect(lfuCache.find("one")?.val.frequency).toBe(2)
  })

  it("should add the node with updated frequency in correct order", () => {

    const lfuCache = new LFUCache()

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "three", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.isCached("two")).toBe(1)
    expect(lfuCache.isCached("three")).toBe(1)

    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.isCached("two")).toBe(2)
    let twoFound = lfuCache.find("two")
    expect(twoFound?.val.frequency).toBe(2)
    expect(twoFound?.next).toBe(null)

    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    twoFound = lfuCache.find("two")
    expect(twoFound?.val.frequency).toBe(3)
    expect(twoFound?.next).toBe(null)
    expect(lfuCache.size()).toBe(4)


    lfuCache.updateCache({ cacheItem: { key: "three", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    const threeFound = lfuCache.find("three")
    expect(threeFound?.val.frequency).toBe(2)
    expect(threeFound?.next?.val.key).toBe("two")
    expect(lfuCache.size()).toBe(4)

    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    let fourFound = lfuCache.find("four")
    expect(fourFound?.val.frequency).toBe(2)
    expect(fourFound?.next?.val.key).toBe("three")
    expect(lfuCache.size()).toBe(4)

    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    fourFound = lfuCache.find("four")
    expect(fourFound?.val.frequency).toBe(4)
    expect(fourFound?.next).toBeNull()
    expect(lfuCache.size()).toBe(4)

  })

  it("should check if the eviction policy is applied", () => {

    const lfuCache = new LFUCache()

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "three", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.size()).toBe(4)

    lfuCache.updateCache({ cacheItem: { key: "five", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.find("one")).toBeNull()
    expect(lfuCache.isCached("one")).not.toBeDefined()
    expect(lfuCache.find("five")?.val.frequency).toBe(1)
    expect(lfuCache.isCached("five")).toBeTruthy()

  })

  it("should check if new element is inserted on queue top when current max frequency > 1", () => {

    const lfuCache = new LFUCache()

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.size()).toBe(2)

    lfuCache.updateCache({ cacheItem: { key: "three", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    expect(lfuCache.size()).toBe(3)
    expect(lfuCache.peek()?.key).toBe("three")

    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    expect(lfuCache.size()).toBe(4)

    lfuCache.updateCache({ cacheItem: { key: "five", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    expect(lfuCache.peek().key).toBe("five")

  })

  it("should test if the curr max frequency and freq Map is adjusted correctly", () => {
    const lfuCache = new LFUCache()

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "three", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })


    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "four", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "three", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.getcurrentMaxFrequency()).toBe(3)
    expect(lfuCache.nodesWithGivenFrequency(3)).toBe(1)
    expect(lfuCache.nodesWithGivenFrequency(2)).toBe(1)

    lfuCache.updateCache({ cacheItem: { key: "one", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })
    lfuCache.updateCache({ cacheItem: { key: "two", type: "LFU", frequency: 1 }, storeCapacity, inMemoryStore, minHeap })

    expect(lfuCache.nodesWithGivenFrequency(2)).toBe(3)
    expect(lfuCache.getcurrentMaxFrequency()).toBe(3)
  })
})
