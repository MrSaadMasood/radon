import { describe, expect, it, should } from "vitest"
import { addKeyValueToMap, deleteKeyFromMap, getValueFromMap } from "../src"

describe("test the CRUD operations on the key value store", () => {

  it("should check if the values are corrected stored, read and deleted from the store", () => {

    addKeyValueToMap("one", { one: "stored" })

    expect(getValueFromMap("one")).toEqual({ one: "stored" })

    deleteKeyFromMap("one")

    expect(getValueFromMap("one")).not.toBeDefined()
  })

  it("should overrride the existing key value if new key value is provided", () => {

    addKeyValueToMap("one", { one: "changed stored" })

    expect(getValueFromMap("one")).toEqual({ one: "changed stored" })
  })

})
