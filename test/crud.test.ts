import { describe, expect, it, vi } from "vitest"
import { addKeyValueToMap, deleteKeyFromMap, getValueFromMap } from "../src"

describe("test the CRUD operations on the key value store", () => {

  it("should check if the values are corrected stored, read and deleted from the store", async () => {

    await addKeyValueToMap("one", { one: "stored" })

    expect(await getValueFromMap("one")).toEqual({ one: "stored" })

    await deleteKeyFromMap("one")

    expect(await getValueFromMap("one")).not.toBeDefined()
  })

  it("should overrride the existing key value if new key value is provided", async () => {

    await addKeyValueToMap("one", { one: "changed stored" })

    expect(await getValueFromMap("one")).toEqual({ one: "changed stored" })
  })

})
