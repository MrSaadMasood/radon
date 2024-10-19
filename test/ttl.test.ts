import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addKeyValueToMap, getValueFromMap } from "../src";

describe("tests the TTL functionality of key-value store", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => vi.useRealTimers())

  it("should correctly store the optional TTL value with the key", () => {

    addKeyValueToMap("first", { random: "stored temporarily" }, 300)
    expect(getValueFromMap("first")).toEqual({ random: "stored temporarily" })

  })

  it("should not retrive the key-value if the TTL expires", () => {

    addKeyValueToMap("first", { random: "stored temporarily" }, 300)

    vi.advanceTimersByTime(260)
    expect(getValueFromMap("first")).toEqual({ random: "stored temporarily" })

    vi.advanceTimersByTime(40)
    expect(getValueFromMap("first")).not.toBeDefined()

  })

  it("should throw an error if TTL is not a number", () => {

    expect(() => addKeyValueToMap("second", "random", "authl")).toThrow()

  })

  it("should store value if an integer string is provided", () => {

    addKeyValueToMap("third", "random", "900")

    vi.advanceTimersByTime(700)
    expect(getValueFromMap("third")).toBe("random")

    vi.advanceTimersByTime(201)
    expect(getValueFromMap("third")).not.toBeDefined()


  })

  it('should use flored floating points if given as TTL', () => {

    addKeyValueToMap("third", "random", 6.4)

    vi.advanceTimersByTime(5)
    expect(getValueFromMap("third")).toBe("random")

    vi.advanceTimersByTime(2)
    expect(getValueFromMap("third")).not.toBeDefined()
  })

  it("should not use TTL if the TTL > MAX_TTL_VALUE ", () => {

    const TTL = 1000000000000
    addKeyValueToMap("third", "random", TTL)
    expect(getValueFromMap("third")).toBe("random")

    vi.advanceTimersByTime(TTL + 1)
    expect(getValueFromMap("third")).toBe("random")


  })

})

