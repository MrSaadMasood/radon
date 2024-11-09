type HeapItem = {
  key: string;
  TTL: number;
};

type InMemoryStore = Map<string, MapValueObject>;

type MapValueObject = {
  value: unknown;
  timestamp?: number;
  TTL?: number;
};

type LRU = {
  key: string;
  timestamp: number;
  type: "LRU";
};

type LFU = {
  key: string;
  frequency: number;
  type: "LFU";
};
type NodeValue = LRU | LFU;

type Policy = "LFU" | "LRU";

type SerialDeserialBase = {
  heap: HeapItem[];
  cachedNodes: NodeValue[];
};
type Serialize = SerialDeserialBase & {
  store: [string, unknown][];
};

type Deserialize = SerialDeserialBase & {
  store: InMemoryStore;
};

type SetRadonOptions = {
  ttl?: string | number;
  url?: string;
  parse?: boolean;
};
