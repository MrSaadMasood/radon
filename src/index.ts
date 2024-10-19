type ValueTTLObjectOfKeyValueStore = {
  value: any,
  TTL?: number
}

type InMemoryStore = {
  [key: string]: ValueTTLObjectOfKeyValueStore
}

const keyStoreMap: InMemoryStore = {}
const MAX_TTL_VALUE = 10000000

function addKeyValueToMap(key: string, value: any, TTL?: string | number) {
  const objectToStore: ValueTTLObjectOfKeyValueStore = {
    value
  }

  if (TTL) {
    const isValidNumber = Number(TTL)
    if (!isValidNumber) throw new Error("the TTL provided is not a number")
    const flooredNumber = Math.floor(isValidNumber)
    if (flooredNumber < MAX_TTL_VALUE) objectToStore.TTL = Date.now() + flooredNumber
  }

  keyStoreMap[key] = objectToStore
}

function getValueFromMap(key: string) {
  let storedValue = keyStoreMap[key]
  if (!storedValue) return
  const TTLExpired = storedValue.TTL && storedValue.TTL <= Date.now()
  if (TTLExpired) {
    delete keyStoreMap[key]
    return
  }
  return storedValue.value
}

function deleteKeyFromMap(key: string) {
  delete keyStoreMap[key]
}

export {
  addKeyValueToMap,
  getValueFromMap,
  deleteKeyFromMap,
  MAX_TTL_VALUE
}

