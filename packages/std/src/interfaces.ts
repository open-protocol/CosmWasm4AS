export interface Storage {
  get: (key: Uint8Array) => Uint8Array | undefined;

  set: (key: Uint8Array, value: Uint8Array) => void;

  remove: (key: Uint8Array) => void;
}