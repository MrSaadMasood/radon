import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  addKeyValueToStore,
  deleteKeyFromStore,
  getValueFromStore,
} from "../src/controllerHelpers";

describe("test the CRUD operations on the key value store", () => {
  beforeAll(() => vi.useFakeTimers());
  afterAll(() => vi.useRealTimers());

  it("should check if the values are corrected stored, read and deleted from the store", async () => {
    await addKeyValueToStore("one", { one: "stored" });

    expect(await getValueFromStore("one")).toEqual({ one: "stored" });

    await deleteKeyFromStore("one");

    expect(await getValueFromStore("one")).not.toBeDefined();
  });

  it("should overrride the existing key value if new key value is provided", async () => {
    await addKeyValueToStore("one", { one: "changed stored" });

    expect(await getValueFromStore("one")).toEqual({ one: "changed stored" });
  });

  it("should test if the value with ttl is stored correctly", async () => {
    await addKeyValueToStore("one", "person", "11");
    expect(await getValueFromStore("one")).toBe("person");
  });

  it("should return without storing the value if the TTL is incorrect", async () => {
    await addKeyValueToStore("two", "person", "abc");
    expect(await getValueFromStore("two")).not.toBeDefined();
  });

  it("should update key with new ttl and value if the key in store is already present with the same key", async () => {
    await addKeyValueToStore("three", "person", "11");
    expect(await getValueFromStore("three")).toBe("person");

    await addKeyValueToStore("three", "changed", "18");
    expect(await getValueFromStore("three")).toBe("changed");
  });

  it("should not get the key if the key with ttl is expired", async () => {
    await addKeyValueToStore("four", "person", "11");
    expect(await getValueFromStore("four")).toBe("person");

    vi.advanceTimersByTime(15 * 1000);

    expect(await getValueFromStore("four")).not.toBeDefined();
  });
});
