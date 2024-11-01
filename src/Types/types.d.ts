
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
