import { Node } from "./Node";

type NodeOrNull<T> = Node<T> | null

class DoublyLinkedList<T> {
  constructor(
    protected head?: NodeOrNull<T>,
    protected tail?: NodeOrNull<T>,
    protected len: number = 0
  ) { }

  print() {
    if (!this.head) return
    let curr: NodeOrNull<T> = this.head;
    while (curr) {
      console.log(curr.val)
      curr = curr.next
    }
  }
}

export class Queue<T> extends DoublyLinkedList<T> {
  constructor(
    head: NodeOrNull<T> = null,
    tail: NodeOrNull<T> = null
  ) {
    super(head, tail)
  }

  peek() {
    if (!this.head) return null
    return this.head.val
  }

  enqueue(value: NodeValue) {
    const node = new Node<NodeValue>(value)
    if (!this.tail) {
      this.tail = node
      this.head = this.tail
    }
    else {
      const prev = this.tail
      this.tail.next = node
      this.tail = this.tail.next
      this.tail.prev = prev

    }
    this.len++
  }

  dequeue() {
    if (!this.head) return null
    const headNode = this.head
    this.head = this.head.next
    if (this.head) this.head.prev = null
    this.len--
    return headNode
  }

  size() {
    return this.len
  }

}
