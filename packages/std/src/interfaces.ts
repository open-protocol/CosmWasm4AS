export interface Storage {
  get: (key: Uint8Array) => Uint8Array | undefined;

  set: (key: Uint8Array, value: Uint8Array) => void;

  remove: (key: Uint8Array) => void;
}

export type Addr = string;
export type CanonicalAddr = Uint8Array;

export interface Api {
  addrValidate: (human: string) => Addr;

  addrCanonicalize: (human: string) => CanonicalAddr;

  addrHumanize: (canonical: CanonicalAddr) => Addr;

  secp256k1Verify: (messageHash: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) => boolean;

  secp256k1RecoverPubkey: (messageHash: Uint8Array, signature: Uint8Array, recoveryParam: u8) => Uint8Array;

  ed25519Verify: (message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array) => boolean;

  ed25519BatchVerify: (messages: Array<Uint8Array>, signatures: Array<Uint8Array>, publicKeys: Array<Uint8Array>) => boolean;

  debug: (message: string) => void;
}