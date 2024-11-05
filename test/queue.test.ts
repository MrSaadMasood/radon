import { describe, expect, it } from "vitest";
import { Queue } from "../src/Classes/Queue"
import { DoublyLinkedList } from "../src/Classes/DoublyLinkedList";

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

  it("should correctly delete a node from the queue", () => {

    const queue = new Queue<NodeValue>()

    queue.enqueue({ key: "one", timestamp: 1 })
    queue.enqueue({ key: "two", timeStamp: 2 })
    queue.enqueue({ key: "three", timestamp: 4 })

    const firstDeletedNode = queue.delete("two")
    expect(firstDeletedNode).toBeDefined()
    expect(firstDeletedNode!.val.key).toBe("two")

    queue.delete("one")
    queue.delete("three")

    expect(queue.delete("empty")).toBeNull()

  })

  it("should correctly find the node in the queue", () => {

    const queue = new Queue<NodeValue>()

    expect(queue.find("four")).toBeNull()

    queue.enqueue({ key: "one", timestamp: 1 })
    queue.enqueue({ key: "two", timeStamp: 2 })
    queue.enqueue({ key: "three", timestamp: 4 })

    expect(queue.find("four")).toBeNull()
    expect(queue.find("one")?.val.timestamp).toBe(1)
  })
})
