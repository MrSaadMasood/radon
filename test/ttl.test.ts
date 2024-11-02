import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { addKeyValueToMap, getValueFromMap } from "../src";

describe.skip("tests the TTL functionality of key-value store", () => {
  beforeAll(() => {
    vi.useFakeTimers()
  })

  afterAll(() => vi.useRealTimers())

  it("should correctly store the optional TTL value with the key", () => {

    addKeyValueToMap("first", { random: "stored temporarily" }, 300)
    expect(getValueFromMap("first")).toEqual({ random: "stored temporarily" })

  })

  it.only("should not retrive the key-value if the TTL expires", () => {

    addKeyValueToMap("first", { random: "stored temporarily" }, 300)

    vi.advanceTimersByTime(2)
    expect(getValueFromMap("first")).toEqual({ random: "stored temporarily" })

    vi.advanceTimersByTime(4000)
    // console.log("the value after timeout is", getValueFromMap("first"))
    expect(getValueFromMap("first")).not.toBeDefined()

  })

  it("should throw an error if TTL is not a number", () => {

    expect(() => addKeyValueToMap("second", "random", "authl")).toThrow()

  })


  it("should store value if an integer string is provided", () => {
    addKeyValueToMap("third", "random", "900")
    expect(getValueFromMap("third")).toBe("random")
  })

  it('should use flored floating points if given as TTL', () => {

    addKeyValueToMap("third", "random", 6.4)

    expect(getValueFromMap("third")).toBe("random")
  })

  it("should not use TTL if the TTL > MAX_TTL_VALUE ", () => {

    const TTL = 1000000000000
    addKeyValueToMap("third", "random", TTL)
    expect(getValueFromMap("third")).toBe("random")

  })

})

