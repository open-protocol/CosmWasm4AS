import { Storage } from "./interfaces";
import { Region } from "./memory";

@external("env", "db_read")
declare function dbRead(key: u32): u32;

@external("env", "db_write")
declare function dbWrite(key: u32, value: u32): void;

@external("env", "db_remove")
declare function dbRemove(key: u32): void;

@external("env", "addr_validate")
declare function addrValidate(sourcePtr: u32): u32;

@external("env", "addr_canonicalize")
declare function addrCanonicalize(sourcePtr: u32, destinationPtr: u32): u32;

@external("env", "addr_humanize")
declare function addrHumanize(sourcePtr: u32, destinationPtr: u32): u32;

@external("env", "secp256k1_verify")
declare function secp256k1Verify(messageHashPtr: u32, signaturePtr: u32, publicKeyPtr: u32): u32;

@external("env", "secp256k1_recover_pubkey")
declare function secp256k1RecoverPubkey(messageHashPtr: u32, signaturePtr: u32, recoveryParam: u32): u64;

@external("env", "ed25519_verify")
declare function ed25519Verify(messagePtr: u32, signaturePtr: u32, publicKeyPtr: u32): u32;

@external("env", "ed25519_batch_verify")
declare function ed25519BatchVerify(messagesPtr: u32, signaturesPtr: u32, publicKeysPtr: u32): u32;

@external("env", "debug")
declare function debug(sourcePtr: u32): void;

@external("env", "query_chain")
declare function queryChain(request: u32): u32;

export class ExternalStorage implements Storage {
  public get(key: Uint8Array): Uint8Array | undefined {
    const keyPtr = Region.buildRegion(key);
    const valuePtr = dbRead(keyPtr);
    if (valuePtr === 0) {
      return undefined;
    }
    return Region.consumeRegion(valuePtr);
  }

  public set(key: Uint8Array, value: Uint8Array): void {
    const keyPtr = Region.buildRegion(key);
    const valuePtr = Region.buildRegion(value);
    dbWrite(keyPtr, valuePtr);
  }

  public remove(key: Uint8Array): void {
    const keyPtr = Region.buildRegion(key);
    dbRemove(keyPtr);
  }
}