import { AsyncLock } from "./Classes/AsyncLock.js"
import { MinHeap } from "./Classes/MinHeap.js"
import { ttlExpirationValidator } from "./utils/utils.js"

const keyStoreMap: InMemoryStore = {}
const minHeap = new MinHeap()
const asyncLock = new AsyncLock

let EXPIRED_KEY_REMOVAL_TIME = 1000
const MAX_TTL_VALUE = 10000000

async function addKeyValueToMap(key: string, value: any, TTL?: string | number) {
  const objectToStore: ValueTTLObjectOfKeyValueStore = {
    value,
  }

  if (TTL) {
    const ttl = TTLInputValidator(TTL)
    await makeKeyStoreOperationsConsistent(
      async () => {
        await asyncLock.keyDataStoreProcessedAndLocked
        const heapItem: HeapItem = { key, TTL: ttl }
        if (keyStoreMap[key]) {
          return minHeap.deleteFromMinHeapAndUpdateWithNewValue(heapItem)
        } else {
          minHeap.insert(heapItem)
          objectToStore.TTL = ttl
          objectToStore.timestamp = Date.now()
        }
        const minHeapRootElem = minHeap.readRootElemValue()
        EXPIRED_KEY_REMOVAL_TIME = minHeapRootElem.TTL
      }
    )
  }

  await makeKeyStoreOperationsConsistent(
    async () => {
      await asyncLock.keyDataStoreProcessedAndLocked
      keyStoreMap[key] = objectToStore
    }
  )
  minHeap.print()
}

function TTLInputValidator(TTL: string | number) {
  const isValidNumber = Number(TTL)
  if (!isValidNumber) throw new Error("the TTL provided is not a number")
  const flooredNumber = Math.floor(isValidNumber)
  if (flooredNumber < MAX_TTL_VALUE) return flooredNumber
  else throw new Error("TTL Limit Exceeded")
}


async function getValueFromMap(key: string) {
  let valueFromMap;

  await makeKeyStoreOperationsConsistent(async () => {

    let storedValue = keyStoreMap[key]
    if (!storedValue) return

    const keyExpired = isKeyExpired(storedValue)
    if (keyExpired) {
      delete keyStoreMap[key]
      return minHeap.deleteFromMinHeapAndUpdateWithNewValue({ key, TTL: -1 })
    }
    valueFromMap = storedValue.value
  })
  return valueFromMap
}

async function deleteKeyFromMap(key: string) {
  await makeKeyStoreOperationsConsistent(() => {
    delete keyStoreMap[key]
  })
}

async function removeExpiredKeysFromHeap() {
  await makeKeyStoreOperationsConsistent(() => {
    const currRootElem = minHeap.cleanUpExpiredKeys(keyStoreMap)
    const expirationTimeOfHeapRootElem = currRootElem ? currRootElem.TTL : Infinity
    EXPIRED_KEY_REMOVAL_TIME = Math.min(EXPIRED_KEY_REMOVAL_TIME, expirationTimeOfHeapRootElem)
    setTimeout(removeExpiredKeysFromHeap, EXPIRED_KEY_REMOVAL_TIME)
  })
}

async function makeKeyStoreOperationsConsistent(callback: () => void) {
  await asyncLock.keyDataStoreProcessedAndLocked;
  asyncLock.enable();
  callback();
  asyncLock.disable()
}

function isKeyExpired(storedObject: ValueTTLObjectOfKeyValueStore) {
  if (!storedObject.timestamp || !storedObject.TTL) return false
  if (ttlExpirationValidator(storedObject.TTL + storedObject.timestamp)) return true
  else return false
}

removeExpiredKeysFromHeap()

export {
  addKeyValueToMap,
  getValueFromMap,
  deleteKeyFromMap,
  MAX_TTL_VALUE
}

