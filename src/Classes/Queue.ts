import { NodeOrNull } from "../Types/exportedTypes.js";
import { DoublyLinkedList } from "./DoublyLinkedList.js";
import { Node } from "./Node.js";

export class Queue<T> extends DoublyLinkedList<T> {
  constructor(head: NodeOrNull<T> = null, tail: NodeOrNull<T> = null) {
    super(head, tail);
  }

  peek() {
    if (!this.head) return null;
    return this.head.val;
  }

  enqueue(value: NodeValue) {
    const node = new Node<NodeValue>(value);
    if (!this.tail) {
      this.tail = node;
      this.head = this.tail;
    } else {
      const prev = this.tail;
      this.tail.next = node;
      this.tail = this.tail.next;
      this.tail.prev = prev;
    }
    this.len++;
  }

  dequeue() {
    if (!this.head) return null;
    const headNode = this.head;
    this.head = this.head.next;
    if (this.head) this.head.prev = null;
    this.len--;
    return headNode;
  }

  size() {
    return this.len;
  }
}
