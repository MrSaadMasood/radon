class AsyncLock {
  disable: () => Promise<void> | void;
  keyDataStoreProcessedAndLocked: Promise<void>

  constructor() {
    this.disable = () => { }
    this.keyDataStoreProcessedAndLocked = Promise.resolve()
  }

  enable() {
    this.keyDataStoreProcessedAndLocked = new Promise(resolve => this.disable = resolve)
  }
}

export { AsyncLock }
