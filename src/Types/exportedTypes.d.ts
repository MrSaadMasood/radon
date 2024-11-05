import { LFUCache } from "../Classes/LFUCache.ts";
import { LRUCache } from "../Classes/LRUCache.ts";
import { MinHeap } from "../Classes/MinHeap.js";
import { Node } from "../Classes/Node.js";

export type NodeOrNull<T> = Node<T> | null

export type TypedNode<T> = Node<T>
export type EvictionClasses = LRUCache<NodeValue> | LFUCache<NodeValue>

export type UpdateCacheOptions = {
  cacheItem: NodeValue,
  storeCapacity: number,
  inMemoryStore: InMemoryStore,
  minHeap: MinHeap
}


