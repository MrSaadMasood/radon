import { NodeOrNull, UpdateCacheOptions } from "../Types/exportedTypes.js";
import { EvictionPolicy } from "./EvictionPolicy.js";
import { Node } from "./Node.js";

export class LFUCache<T> extends EvictionPolicy<T> {

  constructor(
    private currentMaxFreq = 1,
    private freqMap = new Map<number, number>()
  ) {
    super()
  }

  public updateCache({ cacheItem, storeCapacity, inMemoryStore, minHeap }: UpdateCacheOptions) {
    const storeFullAndEvictionPolicyApplicable = this.size() === storeCapacity
    const alreadyCached = this.cachedValuesMap.get(cacheItem.key)
    const updatedFrequency = (alreadyCached || 0) + 1

    if (alreadyCached) {
      const deletedNode = this.deleteCache(cacheItem.key)
      this.insertBasedOnFrequency(deletedNode, updatedFrequency)
    }
    else if (!alreadyCached && storeFullAndEvictionPolicyApplicable) {
      const deletedNode = this.applyEvictionPolicy(inMemoryStore)
      minHeap.deleteFromMinHeapAndUpdateWithNewValue({ key: cacheItem.key, TTL: -1 })
      if (deletedNode && deletedNode.val.type === "LFU") this.adjustFrequency(deletedNode.val.frequency, "DEC")
    }
    this.adjustFrequency(updatedFrequency, "INC")
    this.cachedValuesMap.set(cacheItem.key, updatedFrequency)
    const currentMaxFreq = this.currentMaxFreq
    this.currentMaxFreq = Math.max(currentMaxFreq, updatedFrequency)

    if (!alreadyCached) {
      return currentMaxFreq > 1 ? this.insertOnQueueTop(cacheItem as LFU) : this.enqueue(cacheItem)
    }
  }

  private insertBasedOnFrequency(deletedNode: NodeOrNull<T>, updatedFrequency: number) {
    if (!deletedNode || deletedNode.val.type === "LRU") return

    this.adjustFrequency(deletedNode.val.frequency, "DEC")

    deletedNode.val.frequency = updatedFrequency

    if (!this.head || !this.tail) return this.enqueue(deletedNode.val)

    let curr: NodeOrNull<T> = this.head
    while (curr.next && curr.next.val.type === "LFU" && curr.next.val.frequency < updatedFrequency) {
      curr = curr.next
    }
    if (!curr.next) return this.enqueue(deletedNode.val)

    deletedNode.prev = curr
    deletedNode.next = curr.next
    curr.next = deletedNode
    this.len++
  }

  private insertOnQueueTop(cacheItem: LFU) {
    if (!this.head) return this.enqueue(cacheItem)
    const node = new Node(cacheItem)
    node.next = this.head;
    this.head = node
    this.len++
  }

  public adjustFrequency(freqToUpdate: number, operation: "INC" | "DEC") {
    const totalNodesWithThisFrequency = this.nodesWithGivenFrequency(freqToUpdate)
    switch (operation) {
      case "INC":
        this.freqMap.set(freqToUpdate, totalNodesWithThisFrequency + 1)
        break;
      case "DEC":
        if (totalNodesWithThisFrequency - 1 < 1) {
          this.freqMap.delete(freqToUpdate)
          const allFrequenciesOfNodes = Array.from(this.freqMap.keys())
          this.currentMaxFreq = Math.max(...allFrequenciesOfNodes)
        }
        this.freqMap.set(freqToUpdate, totalNodesWithThisFrequency - 1)
        break
    }
  }

  public nodesWithGivenFrequency(freq: number) {
    return this.freqMap.get(freq) || 0
  }

  public getcurrentMaxFrequency() {
    return this.currentMaxFreq
  }


}
