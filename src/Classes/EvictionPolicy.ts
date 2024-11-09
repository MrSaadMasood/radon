import { UpdateCacheOptions } from "../Types/exportedTypes.js";
import { Queue } from "./Queue.js";

export abstract class EvictionPolicy<T> extends Queue<T> {
  constructor(protected cachedValuesMap = new Map<string, number>()) {
    super();
  }

  public abstract updateCache(args: UpdateCacheOptions): void;

  public deleteCache(key: string) {
    const cachedValue = this.delete(key);
    if (!cachedValue) return null;
    const removedCacheValueKey = cachedValue.val.key;
    this.cachedValuesMap.delete(removedCacheValueKey);
    return cachedValue;
  }

  public isCached(key: string) {
    return this.cachedValuesMap.get(key);
  }

  protected applyEvictionPolicy(inMemoryStore: InMemoryStore) {
    const evictedNode = this.dequeue();
    if (!evictedNode) return;
    this.cachedValuesMap.delete(evictedNode.val.key);
    inMemoryStore.delete(evictedNode.val.key);
    return evictedNode;
  }
}
