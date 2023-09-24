import { Addr, CanonicalAddr } from "./addresses";

export class Storage {
  public get(key: Uint8Array): Uint8Array | null { 
    throw new Error("not implemented");
  }

  public set(key: Uint8Array, value: Uint8Array): void {
    throw new Error("not implemented");
  }

  public remove(key: Uint8Array): void {
    throw new Error("not implemented");
  }
}

export class Api {
  public addrValidate(human: string): Addr {
    throw new Error("not implemented");
  }

  public addrCanonicalize(human: string): CanonicalAddr {
    throw new Error("not implemented");
  }

  public addrHumanize(canonical: CanonicalAddr): Addr {
    throw new Error("not implemented");
  }

  public secp256k1Verify(messageHash: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    throw new Error("not implemented");
  }

  public secp256k1RecoverPubkey(messageHash: Uint8Array, signature: Uint8Array, recoveryParam: u8): Uint8Array {
    throw new Error("not implemented");
  }

  public ed25519Verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    throw new Error("not implemented");
  }

  public ed25519BatchVerify(messages: Array<Uint8Array>, signatures: Array<Uint8Array>, publicKeys: Array<Uint8Array>): boolean {
    throw new Error("not implemented");
  }

  public debug(message: string): void {
    throw new Error("not implemented");
  }
}