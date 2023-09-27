import { Addr } from "./addresses";
import { Coin } from "./coin";

// @ts-ignore
@json
export class Env {
  block: BlockInfo;
  transaction: TransactionInfo | null;
  contract: ContractInfo;
}

// @ts-ignore
@json
export class TransactionInfo {
  index: u32;
}

export type Timestamp = string;

// @ts-ignore
@json
export class BlockInfo {
  height: u64;
  time: Timestamp;
  chain_id: string;
}

// @ts-ignore
@json
export class MessageInfo {
  sender: Addr;
  funds: Array<Coin>;
}

// @ts-ignore
@json
export class ContractInfo {
  address: Addr;
}
