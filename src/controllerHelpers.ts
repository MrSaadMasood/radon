import { writeFile } from "fs/promises";
import { AsyncLock } from "./Classes/AsyncLock.js";
import { LFUCache } from "./Classes/LFUCache.js";
import { LRUCache } from "./Classes/LRUCache.js";
import { MinHeap } from "./Classes/MinHeap.js";
import { EVICTION_POLICY, STORE_CAPACITY } from "./utils/envSchema.js";
import {
  cacheItemGenerator,
  cacheUseableNodes,
  cleanUpExpiredKeys,
  isKeyExpired,
  parseJsonFile,
  TTLInputValidator,
} from "./utils/utils.js";

let EXPIRED_KEY_REMOVAL_TIME = 1000;
const MAX_TTL_VALUE = 10000000;

let inMemoryStore: InMemoryStore = new Map();
const minHeap = new MinHeap();
const asyncLock = new AsyncLock();
const evictionPolicies = {
  LRU: LRUCache,
  LFU: LFUCache,
};
const evictionPolicy = new evictionPolicies[EVICTION_POLICY]<NodeValue>();

async function addKeyValueToStore(
  key: string,
  value: unknown,
  TTL?: string | number,
) {
  if (value instanceof Date) value = value.toDateString();
  const objectToStore: MapValueObject = {
    value,
  };

  const timestamp = Date.now()
  if (TTL) {
    let ttlInMiliseconds = TTLInputValidator(TTL, MAX_TTL_VALUE);
    if (!ttlInMiliseconds) return;
    ttlInMiliseconds = ttlInMiliseconds * 1000;

    await makeKeyStoreOperationsConsistent(async () => {
      await asyncLock.keyDataStoreProcessedAndLocked;
      const isKeyAlreadyPresent = inMemoryStore.has(key);
      const heapItem: HeapItem = { key, TTL: ttlInMiliseconds };
      if (isKeyAlreadyPresent) {
        minHeap.deleteFromMinHeapAndUpdateWithNewValue(heapItem);
      } else {
        minHeap.insert(heapItem);
      }
      objectToStore.TTL = ttlInMiliseconds;
      objectToStore.timestamp = timestamp;
      const minHeapRootElem = minHeap.readRootElemValue();
      if (minHeapRootElem) EXPIRED_KEY_REMOVAL_TIME = minHeapRootElem.TTL;
    });
  }

  await makeKeyStoreOperationsConsistent(async () => {
    await asyncLock.keyDataStoreProcessedAndLocked;
    inMemoryStore.set(key, objectToStore);
    evictionPolicy.updateCache(
      generateUpdateCacheOptions(cacheItemGenerator(key, EVICTION_POLICY)),
    );
  });
  return key;
}

async function getValueFromStore(key: string) {
  let valueFromMap: unknown;

  await makeKeyStoreOperationsConsistent(async () => {
    await asyncLock.keyDataStoreProcessedAndLocked;
    const storedValue = inMemoryStore.get(key);
    if (!storedValue) return;
    const keyExpired = isKeyExpired(storedValue);
    if (keyExpired) {
      inMemoryStore.delete(key);
      evictionPolicy.deleteCache(key);
      return minHeap.deleteFromMinHeapAndUpdateWithNewValue({ key, TTL: -1 });
    }
    valueFromMap = storedValue.value;
    Promise.resolve(() => {
      evictionPolicy.updateCache(
        generateUpdateCacheOptions(cacheItemGenerator(key, EVICTION_POLICY)),
      );
    });
  });
  return valueFromMap;
}

async function deleteKeyFromStore(key: string) {
  await makeKeyStoreOperationsConsistent(() => {
    const deletedNode = evictionPolicy.deleteCache(key);
    if (
      evictionPolicy instanceof LFUCache &&
      deletedNode &&
      deletedNode.val.type === "LFU"
    ) {
      evictionPolicy.adjustFrequency(deletedNode.val.frequency, "DEC");
    }
    inMemoryStore.delete(key);
  });
}

function generateUpdateCacheOptions(cacheItem: NodeValue) {
  return {
    cacheItem,
    storeCapacity: STORE_CAPACITY,
    inMemoryStore: inMemoryStore,
    minHeap,
  };
}

async function makeKeyStoreOperationsConsistent(callback: () => void) {
  await asyncLock.keyDataStoreProcessedAndLocked;
  asyncLock.enable();
  callback();
  asyncLock.disable();
}

async function serializer(toSerialize: Serialize, filename: string) {
  await makeKeyStoreOperationsConsistent(async () => {
    try {
      await writeFile(filename, JSON.stringify(toSerialize));
    } catch (error) {
      console.log("serialization failed", error)
    }
  });
}

async function deserializer(filename: string) {
  const parsedData = await parseJsonFile(filename);
  if (!parsedData) return;
  const { store, cachedNodes, heap } = parsedData;
  const { storeAfterCleanup, cachedNodeWithExpiredKeysRemoved, useableHeap } =
    cleanUpExpiredKeys(store, heap, cachedNodes);
  const isStoreEmptyAfterCleanup = storeAfterCleanup.size === 0;
  if (!isStoreEmptyAfterCleanup) {
    minHeap.heap = useableHeap;
    cacheUseableNodes(cachedNodeWithExpiredKeysRemoved, evictionPolicy);
    inMemoryStore = storeAfterCleanup;
  }
}

async function removeExpiredKeysFromHeap() {
  await makeKeyStoreOperationsConsistent(() => {
    const currRootElem = minHeap.cleanUpExpiredKeys(
      inMemoryStore,
      evictionPolicy,
    );
    const expirationTimeOfHeapRootElem = currRootElem
      ? currRootElem.TTL
      : Infinity;
    EXPIRED_KEY_REMOVAL_TIME = Math.min(
      EXPIRED_KEY_REMOVAL_TIME,
      expirationTimeOfHeapRootElem,
    );
    setTimeout(removeExpiredKeysFromHeap, EXPIRED_KEY_REMOVAL_TIME);
  });
}

function periodicallySerializeData(time: number, filename: string) {
  setTimeout(() => {
    const toSerialize: Serialize = {
      store: Array.from(inMemoryStore.entries()),
      cachedNodes: evictionPolicy.getAllNodesValues(),
      heap: minHeap.heap,
    };

    serializer(toSerialize, filename);
    periodicallySerializeData(time, filename);
  }, time);
}

export {
  addKeyValueToStore,
  deleteKeyFromStore,
  deserializer,
  getValueFromStore,
  MAX_TTL_VALUE,
  periodicallySerializeData,
  removeExpiredKeysFromHeap, serializer
};
