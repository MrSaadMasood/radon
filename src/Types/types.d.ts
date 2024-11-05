
type HeapItem = {
  key: string,
  TTL: number
}

type InMemoryStore = {
  [key: string]: ValueTTLObjectOfKeyValueStore
}

type ValueTTLObjectOfKeyValueStore = {
  value: any,
  timestamp?: number
  TTL?: number
}

type LRU = {
  key: string
  timestamp: number
  type: "LRU"
}

type LFU = {
  key: string
  frequency: number
  type: "LFU"
}
type NodeValue = LRU | LFU

type EvictionPolicies = "LFU" | "LRU"
