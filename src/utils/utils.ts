import { readFile } from "fs/promises"
import path from "path"
import { EvictionClasses } from "../Types/exportedTypes.js"

export function ttlExpirationValidator(storedTTLWithTimeStampAdded: number) {
  return Date.now() > storedTTLWithTimeStampAdded
}


export function cleanUpExpiredKeys(store: InMemoryStore, heap: HeapItem[], cachedNodes: NodeValue[]) {
  const expiredNodes: { [key: string]: boolean } = {}
  const useableHeap: HeapItem[] = []
  for (let i = 0, len = heap.length; i < len; i++) {
    const { key, TTL } = heap[i]
    const storedTimestamp = ((store.get(key) || {}).timestamp || 0)
    const isTTLExpired = ttlExpirationValidator(storedTimestamp + TTL)
    if (!isTTLExpired) useableHeap.push(heap[i])
    else {
      store.delete(key)
      expiredNodes[key] = true
    }
  }

  const cachedNodeWithExpiredKeysRemoved: NodeValue[] = []

  for (let i = 0, len = cachedNodes.length; i < len; i++) {
    const cachedNode = cachedNodes[i]
    if (!expiredNodes[cachedNode.key]) cachedNodeWithExpiredKeysRemoved.push(cachedNode)
  }

  return { storeAfterCleanup: store, useableHeap, cachedNodeWithExpiredKeysRemoved }
}

export function cacheUseableNodes(nodes: NodeValue[], evictionPolicy: EvictionClasses) {
  for (let i = 0, len = nodes.length; i < len; i++) {
    evictionPolicy.enqueue(nodes[i])
  }
}


export function isKeyExpired(storedObject: MapValueObject) {
  if (!storedObject.timestamp || !storedObject.TTL) return false
  if (ttlExpirationValidator(storedObject.TTL + storedObject.timestamp)) return true
  else return false
}

export function TTLInputValidator(TTL: string | number, MAX_TTL_VALUE: number) {
  try {
    const isValidNumber = Number(TTL)
    if (!isValidNumber) throw new Error("the TTL provided is not a number")
    const flooredNumber = Math.floor(isValidNumber)
    if (flooredNumber < MAX_TTL_VALUE) return flooredNumber
    else throw new Error("TTL Limit Exceeded")
  } catch (error) {
    console.log(error)
    return
  }
}

export function cacheItemGenerator(key: string, policy: Policy) {
  return policy === "LFU" ? {
    key,
    type: policy,
    frequency: 1
  } : {
    key,
    type: policy,
    timestamp: Date.now()
  }
}

export async function parseJsonFile(filename: string) {
  try {
    const filePath = path.join(process.cwd(), filename)
    const jsonFile = await readFile(filePath, "utf8")
    const parsedJson: Deserialize = JSON.parse(jsonFile, (k, v) => {
      if (k === "store") return new Map(v)
      return v
    })
    return parsedJson
  } catch (error) {
    console.log("parsing the store file failed")
    return
  }
}
