import { describe, expect, it } from "vitest";
import {
  cacheItemGenerator,
  TTLInputValidator
} from "../src/utils/utils";

describe("should test the utils properly", () => {
  it("should test the  TTLInputValidator function ", () => {
    expect(TTLInputValidator(5, 7)).toBe(5);
    expect(TTLInputValidator(8, 7)).not.toBeDefined();
    expect(TTLInputValidator(8, 8)).not.toBeDefined();
  });

  it("should test the  cacheItemGenerator function", () => {
    expect(cacheItemGenerator("one", "LFU")).toEqual({
      key: "one",
      type: "LFU",
      frequency: 1,
    });

    expect(cacheItemGenerator("two", "LRU")).toEqual({
      key: "two",
      type: "LRU",
      timestamp: expect.any(Number),
    });
  });
});
