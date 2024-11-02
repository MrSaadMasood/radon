import { describe, expect, it } from "vitest";
import { Queue } from "../src/Classes/Queue"

describe("tests the queue funtionality", () => {
  it("should correctly enqueue to the queue", () => {

    const queue = new Queue<NodeValue>()

    expect(queue.peek()).toBeNull()

    queue.enqueue({ key: "one", timestamp: 1 })
    queue.enqueue({ key: "two", timeStamp: 2 })
    queue.enqueue({ key: "three", timestamp: 4 })


    expect(queue.peek().key).toBe("one")
    expect(queue.peek().timestamp).toBe(1)
  })

  it('should dequeue correctly', () => {
    const queue = new Queue<NodeValue>()

    expect(queue.dequeue()).toBeNull()

    queue.enqueue({ key: "one", timestamp: 1 })
    queue.enqueue({ key: "two", timeStamp: 2 })
    queue.enqueue({ key: "three", timestamp: 4 })

    expect(queue.dequeue()).toBeDefined()
    expect(queue.dequeue()?.val.key).toBe("two")
    expect(queue.dequeue()?.val.timestamp).toBe(4)

    expect(queue.dequeue()).toBeNull()
  })

  it("should correctly tell the length of the lhe doubly linked list", () => {

    const queue = new Queue<NodeValue>()

    queue.enqueue({ key: "one", timestamp: 1 })
    queue.enqueue({ key: "two", timeStamp: 2 })
    queue.enqueue({ key: "three", timestamp: 4 })

    expect(queue.size()).toBe(3)
  })
})
