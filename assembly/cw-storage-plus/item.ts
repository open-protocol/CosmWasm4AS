import { JSON } from "json-as/assembly";
import { Storage } from "../std";

export class Item<T> {
  storageKey: Uint8Array;

  constructor(storageKey: string) {
    this.storageKey = Uint8Array.wrap(String.UTF8.encode(storageKey));
  }

  public save(store: Storage, data: T): void {
    store.set(this.storageKey, Uint8Array.wrap(String.UTF8.encode(JSON.stringify(data))));
  }

  public remove(store: Storage): void {
    store.remove(this.storageKey);
  }

  public load(store: Storage): T {
    const value = store.get(this.storageKey);
    if (value) {
      return JSON.parse(String.UTF8.decode(value));
    } else {
      // todo: errors will be replaced with typed error
      throw new Error();
    }
  }

  public mayLoad(store: Storage): T | null {
    const value = store.get(this.storageKey);
    if (value) {
      return JSON.parse(String.UTF8.decode(value));
    } else {
      return null;
    }
  }

  public exists(store: Storage): boolean {
    return store.get(this.storageKey) !== null;
  }

  public update(store: Storage, action: (input: T) => T): void {
    const input = this.load(store);
    const output = action(input);
    this.save(store, output);
  }
}