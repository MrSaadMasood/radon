import { NodeOrNull } from "../Types/exportedTypes.js";

export class DoublyLinkedList<T> {
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

  delete(key: string): NodeOrNull<T> {
    if (!this.head) return null
    let deletedNode = null
    let curr: NodeOrNull<T> = this.head
    while (curr) {
      if (curr.val.key === key) {
        deletedNode = curr
        const isTailNodeDeleted = this.tail === deletedNode
        const isHeadNodeDeletd = deletedNode === this.head
        const { prev, next } = curr
        if (isHeadNodeDeletd) {
          this.head = next
          if (next) next.prev = null
        }
        else if (!isHeadNodeDeletd && prev) {
          prev.next = next
        }
        if (next) {
          next.prev = prev
        }
        if (this.tail && isTailNodeDeleted) this.tail = this.tail.prev
        this.len--
        break
      }
      curr = curr.next
    }
    return deletedNode
  }

  find(key: string) {
    if (!this.head) return null;
    let curr: NodeOrNull<T> = this.head;
    while (curr) {
      if (curr.val.key === key) return curr
      curr = curr.next
    }
    return null
  }

  getAllNodesValues() {
    const nodes: NodeValue[] = []
    let curr = this.head
    while (curr) {
      nodes.push(curr.val)
      curr = curr.next
    }

    return nodes
  }
}
