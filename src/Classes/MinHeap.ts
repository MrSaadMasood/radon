import { ttlExpirationValidator } from "../utils/utils";

class MinHeap {
  private readonly heapArray: HeapItem[]
  private len: number

  constructor() {
    this.heapArray = []
    this.len = 0;
  }

  insert(heapItem: HeapItem) {
    this.heapArray.push(heapItem)
    this.len++
    this.bubbleUpHeap(this.len - 1)
  }

  cleanUpExpiredKeys(inMemoryStore: InMemoryStore) {
    let rootElem = this.readRootElemValue()
    if (!rootElem) return
    const storedTimeStamp = inMemoryStore[rootElem.key].timestamp || 0
    let isTTLExpired = ttlExpirationValidator(rootElem.TTL + storedTimeStamp)

    while (isTTLExpired) {
      const rootElemRemoved = this.getMinimum()
      rootElem = this.readRootElemValue()
      if (!rootElemRemoved) break
      delete inMemoryStore[rootElemRemoved.key]
      if (!rootElem) return
      isTTLExpired = ttlExpirationValidator(rootElem.TTL + storedTimeStamp)
    }
    return this.heapArray[0]
  }

  private getMinimum() {
    if (this.heapArray.length < 2) return this.heapArray.pop()
    const rootElem = this.heapArray[0]
    this.heapArray[0] = this.heapArray.pop() || {} as HeapItem
    this.bubbleDownHeap(0)
    return rootElem
  }

  private bubbleUpHeap(childIndex: number) {
    while (childIndex > 0) {
      const parent = Math.floor(childIndex / 2)
      if (this.heapArray[parent].TTL > this.heapArray[childIndex].TTL) {
        this.swap(parent, childIndex)
      }
      childIndex = parent
    }
  }

  private bubbleDownHeap(parentIndex: number) {
    while (true) {
      const rightChildIndex = (parentIndex + 1) * 2
      const leftChildIndex = rightChildIndex - 1

      const rightChild = this.heapArray[rightChildIndex]
      const leftChild = this.heapArray[leftChildIndex]
      const parent = this.heapArray[parentIndex]
      let childToSwapIndex: number | null = null

      if (leftChild && parent.TTL > leftChild.TTL)
        childToSwapIndex = leftChildIndex

      const dontSwapChild = childToSwapIndex === null
      if (rightChild && parent.TTL > rightChild.TTL && (
        dontSwapChild || childToSwapIndex !== null && rightChild.TTL < this.heapArray[childToSwapIndex].TTL)
      )
        childToSwapIndex = rightChildIndex

      if (!childToSwapIndex) break;
      this.swap(parentIndex, childToSwapIndex)
      parentIndex = childToSwapIndex
    }

  }

  private swap(toSwap: number, swapWith: number) {
    const temp = this.heapArray[toSwap]
    this.heapArray[toSwap] = this.heapArray[swapWith]
    this.heapArray[swapWith] = temp
  }

  deleteFromMinHeapAndUpdateWithNewValue(heapItem: HeapItem) {
    const { key, TTL } = heapItem
    for (let i = 0; i < this.len; i++) {
      if (this.heapArray[i].key === key) {
        this.heapArray[i].TTL = TTL
      }
    }
    this.heapify(this.len - 1)
  }

  private heapify(parentIndex: number) {
    if (parentIndex < 0) return
    let smallestElemIndex = parentIndex
    const leftChildIndex = parentIndex * 2 + 1
    const rightChildIndex = leftChildIndex - 1

    if (leftChildIndex < this.len && this.heapArray[smallestElemIndex].TTL > this.heapArray[leftChildIndex].TTL)
      smallestElemIndex = leftChildIndex

    if (rightChildIndex < this.len && this.heapArray[smallestElemIndex].TTL > this.heapArray[rightChildIndex].TTL)
      smallestElemIndex = rightChildIndex

    if (smallestElemIndex !== parentIndex) {
      this.swap(parentIndex, smallestElemIndex)
    }
    this.heapify(parentIndex - 1)
  }

  readRootElemValue() {
    return this.heapArray[0]
  }
  print() {
    console.log("The heap is", this.heapArray)
  }
}


export { MinHeap };
