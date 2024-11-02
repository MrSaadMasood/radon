
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
}

type LFU = {
  key: string
  frequency: number
}
type NodeValue = LRU | LFU
