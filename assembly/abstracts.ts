import { Addr, CanonicalAddr } from "./addresses";

export abstract class Storage {
  public abstract get(key: Uint8Array): Uint8Array | null;

  public abstract set(key: Uint8Array, value: Uint8Array): void;

  public abstract remove(key: Uint8Array): void;
}

export abstract class Api {
  public abstract addrValidate(human: string): Addr;

  public abstract addrCanonicalize(human: string): CanonicalAddr;

  public abstract addrHumanize(canonical: CanonicalAddr): Addr;

  public abstract secp256k1Verify(messageHash: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean;

  public abstract secp256k1RecoverPubkey(messageHash: Uint8Array, signature: Uint8Array, recoveryParam: u8): Uint8Array;

  public abstract ed25519Verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean;

  public abstract ed25519BatchVerify(messages: Array<Uint8Array>, signatures: Array<Uint8Array>, publicKeys: Array<Uint8Array>): boolean;

  public abstract debug(message: string): void;
}

export type QuerierResult = Uint8Array;

export abstract class Querier {
  public abstract rawQuery(binRequest: Uint8Array): QuerierResult ;
}