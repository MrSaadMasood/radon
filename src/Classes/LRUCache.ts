import { UpdateCacheOptions } from "../Types/exportedTypes.js";
import { EvictionPolicy } from "./EvictionPolicy.js";



export class LRUCache<T> extends EvictionPolicy<T> {

  public updateCache({ cacheItem, storeCapacity, inMemoryStore, minHeap }: UpdateCacheOptions) {
    const isEvictionPolicyApplicable = this.size() === storeCapacity
    const alreadyCached = this.cachedValuesMap.get(cacheItem.key)
    if (alreadyCached) this.deleteCache(cacheItem.key)
    else if (!alreadyCached && isEvictionPolicyApplicable) {
      this.applyEvictionPolicy(inMemoryStore)
      minHeap.deleteFromMinHeapAndUpdateWithNewValue({ key: cacheItem.key, TTL: -1 })
    }
    this.cachedValuesMap.set(cacheItem.key, 1)
    this.enqueue(cacheItem)
  }

}


