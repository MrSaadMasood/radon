export class Node<T> {
  constructor(
    public val: NodeValue,
    public next: Node<T> | null = null,
    public prev: Node<T> | null = null
  ) { }
}

