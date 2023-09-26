import { JSON } from "json-as/assembly";
import { Addr, CanonicalAddr } from "./addresses";
import { Api, Querier, QuerierResult, Storage } from "./interfaces";
import { Region } from "./memory";
import { Sections } from "./sections";

// @ts-ignore
@external("env", "db_read")
declare function dbRead(key: u32): u32;

// @ts-ignore
@external("env", "db_write")
declare function dbWrite(key: u32, value: u32): void;

// @ts-ignore
@external("env", "db_remove")
declare function dbRemove(key: u32): void;

// @ts-ignore
@external("env", "addr_validate")
declare function addrValidate(sourcePtr: u32): u32;

// @ts-ignore
@external("env", "addr_canonicalize")
declare function addrCanonicalize(sourcePtr: u32, destinationPtr: u32): u32;

// @ts-ignore
@external("env", "addr_humanize")
declare function addrHumanize(sourcePtr: u32, destinationPtr: u32): u32;

// @ts-ignore
@external("env", "secp256k1_verify")
declare function secp256k1Verify(messageHashPtr: u32, signaturePtr: u32, publicKeyPtr: u32): u32;

// @ts-ignore
@external("env", "secp256k1_recover_pubkey")
declare function secp256k1RecoverPubkey(messageHashPtr: u32, signaturePtr: u32, recoveryParam: u32): u64;

// @ts-ignore
@external("env", "ed25519_verify")
declare function ed25519Verify(messagePtr: u32, signaturePtr: u32, publicKeyPtr: u32): u32;

// @ts-ignore
@external("env", "ed25519_batch_verify")
declare function ed25519BatchVerify(messagesPtr: u32, signaturesPtr: u32, publicKeysPtr: u32): u32;

// @ts-ignore
@external("env", "debug")
declare function debug(sourcePtr: u32): void;

// @ts-ignore
@external("env", "query_chain")
declare function queryChain(request: u32): u32;

export class ExternalStorage extends Storage {
  public get(key: Uint8Array): Uint8Array | null {
    const keyPtr = Region.buildRegion(key);
    const valuePtr = dbRead(keyPtr);
    if (valuePtr === 0) {
      return null;
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

const CANONICAL_ADDRESS_BUFFER_LENGTH: usize = 64;
const HUMAN_ADDRESS_BUFFER_LENGTH: usize = 90;

export class ExternalApi extends Api {
  public addrValidate(input: string): Addr {
    const inputBytes = Uint8Array.wrap(String.UTF8.encode(input));
    if (inputBytes.byteLength > 256) {
      throw new Error("input too long for addrValidate");
    }
    const sourcePtr = Region.buildRegion(inputBytes);
    const result = addrValidate(sourcePtr);
    if (result !== 0) {
      const error = String.UTF8.decode(Region.consumeRegion(result).buffer);
      throw new Error(`addrValidate errored: ${error}`);
    }
    return input;
  }

  public addrCanonicalize(input: string): CanonicalAddr {
    const inputBytes = Uint8Array.wrap(String.UTF8.encode(input));
    if (inputBytes.byteLength > 256) {
      throw new Error("input too long for addrCanonicalize");
    }
    const sendPtr = Region.buildRegion(inputBytes);
    const canon = Region.alloc(CANONICAL_ADDRESS_BUFFER_LENGTH);
    const result = addrCanonicalize(sendPtr, canon as u32);
    if (result !== 0) {
      const error = String.UTF8.decode(Region.consumeRegion(result).buffer);
      throw new Error(`addrCanonicalize errored: ${error}`);
    }
    const out = Region.consumeRegion(canon);
    return out;
  }

  public addrHumanize(canonical: CanonicalAddr): Addr {
    const sendPtr = Region.buildRegion(canonical);
    const human = Region.alloc(HUMAN_ADDRESS_BUFFER_LENGTH);
    const result = addrHumanize(sendPtr, human as u32);
    if (result !== 0) {
      const error = String.UTF8.decode(Region.consumeRegion(result).buffer);
      throw new Error(`addrHumanize errored: ${error}`);
    }
    const address = String.UTF8.decode(Region.consumeRegion(human));
    return address;
  }

  public secp256k1Verify(messageHash: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    const hashSendPtr = Region.buildRegion(messageHash);
    const sigSendPtr = Region.buildRegion(signature);
    const pubkeySendPtr = Region.buildRegion(publicKey);
    const result = secp256k1Verify(hashSendPtr, sigSendPtr, pubkeySendPtr);
    // todo: errors will be replaced typed error
    switch (result) {
      case 0: return true;
      case 1: return false;
      case 2: throw new Error("MessageTooLong must not happen. This is a bug in the VM.");
      case 3: throw new Error("VerificationError::InvalidHashFormat");
      case 4: throw new Error("VerificationError::InvalidSignatureFormat");
      case 5: throw new Error("VerificationError::InvalidPubkeyFormat");
      case 10: throw new Error("VerificationError::GenericErr");
      default: throw new Error(`VerificationError::UnknownError: ${result}`);
    }
  }

  public secp256k1RecoverPubkey(messageHash: Uint8Array, signature: Uint8Array, recoveryParam: number): Uint8Array {
    const hashSendPtr = Region.buildRegion(messageHash);
    const sigSendPtr = Region.buildRegion(signature);
    const result = secp256k1RecoverPubkey(hashSendPtr, sigSendPtr, recoveryParam);
    const errorCode = (result >> 32) as u32;
    const pubkeyPtr = (result & 0xFFFFFFFF) as u32;
    // todo: errors will be replaced typed error
    switch(errorCode) {
      case 0: return Region.consumeRegion(pubkeyPtr);
      case 2: throw new Error("MessageTooLong must not happen. This is a bug in the VM.");
      case 3: throw new Error("RecoverPubkeyError::InvalidHashFormat");
      case 4: throw new Error("RecoverPubkeyError::InvalidSignatureFormat");
      case 6: throw new Error("RecoverPubkeyError::InvalidRecoveryParam");
      default: throw new Error(`RecoverPubkeyError::UnknownError: ${errorCode}`);
    }
  }

  public ed25519Verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean {
    const msgSendPtr = Region.buildRegion(message);
    const sigSendPtr = Region.buildRegion(signature);
    const pubkeySendPtr = Region.buildRegion(publicKey);
    const result = ed25519Verify(msgSendPtr, sigSendPtr, pubkeySendPtr);
    // todo: errors will be replaced typed error
    switch(result) {
      case 0: return true;
      case 1: return false;
      case 2: throw new Error("Error code 2 unused since CosmWasm 0.15. This is a bug in the VM.");
      case 3: throw new Error("InvalidHashFormat must not happen. This is a bug in the VM.");
      case 4: throw new Error("VerificationError::InvalidSignatureFormat");
      case 5: throw new Error("VerificationError::InvalidPubkeyFormat");
      case 10: throw new Error("VerificationError::GenericErr");
      default: throw new Error(`VerificationError::UnknownError: ${result}`);
    }
  }

  public ed25519BatchVerify(messages: Array<Uint8Array>, signatures: Array<Uint8Array>, publicKeys: Array<Uint8Array>): boolean {
    const msgsEncoded = Sections.encodeSections(messages);
    const msgsSendPtr = Region.buildRegion(msgsEncoded);
    const sigsEncoded = Sections.encodeSections(signatures);
    const sigsSendPtr = Region.buildRegion(sigsEncoded);
    const pubkeysEncoded = Sections.encodeSections(publicKeys);
    const pubkeysSendPtr = Region.buildRegion(pubkeysEncoded);
    const result = ed25519BatchVerify(msgsSendPtr, sigsSendPtr, pubkeysSendPtr);
    // todo: errors will be replaced typed error
    switch(result) {
      case 0: return true;
      case 1: return false;
      case 2: throw new Error("Error code 2 unused since CosmWasm 0.15. This is a bug in the VM.");
      case 3: throw new Error("InvalidHashFormat must not happen. This is a bug in the VM.");
      case 4: throw new Error("VerificationError::InvalidSignatureFormat");
      case 5: throw new Error("VerificationError::InvalidPubkeyFormat");
      case 10: throw new Error("VerificationError::GenericErr");
      default: throw new Error(`VerificationError::UnknownError: ${result}`);
    }
  }

  public debug(message: string): void {
    const regionPtr = Region.buildRegion(Uint8Array.wrap(String.UTF8.encode(message)));
    debug(regionPtr);
  }
}

export class ExternalQuerier extends Querier {
  public rawQuery(binRequest: Uint8Array): QuerierResult {
    const requestPtr = Region.buildRegion(binRequest);
    const responsePtr = queryChain(requestPtr);
    const response = Region.consumeRegion(responsePtr);
    JSON.parse(String.UTF8.decode(response));
    return response;
  }
}