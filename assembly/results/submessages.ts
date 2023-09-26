import { CosmosMsg } from "./cosmos_msg";

export type ReplyOn = "always" | "error" | "success" | "never";

// @ts-ignore
@json
export class SubMsg {
  id: u64;
  msg: CosmosMsg;
  gas_limit: u64 | null;
  reply_on: ReplyOn
}