import { Coin } from "../coin";

// @ts-ignore
@json
export class CosmosMsg {
  bank: BankMsg;
  wasm: WasmMsg;
}

// @ts-ignore
@json
export class BankMsg {
  send: BankSendMsg | null;
  burn: BankBurnMsg | null;
}

// @ts-ignore
@json
export class BankSendMsg {
  to_address: string;
  amount: Array<Coin>;
}

// @ts-ignore
@json
export class BankBurnMsg {
  amount: Array<Coin>;
}

// @ts-ignore
@json
export class WasmMsg {
  execute: WasmExecuteMsg | null;
  instantiate: WasmInstantiateMsg | null;
  instantiate2: WasmInstantiate2Msg | null;
  migrate: WasmMigrateMsg | null;
  update_admin: WasmUpdateAdminMsg | null;
  clear_admin: WasmClearAdminMsg | null;
}

// @ts-ignore
@json
export class WasmExecuteMsg {
  contract_addr: string;
  msg: Uint8Array;
  funds: Array<Coin>;
}

// @ts-ignore
@json
export class WasmInstantiateMsg {
  admin: string | null;
  code_id: u64;
  msg: Uint8Array;
  funds: Array<Coin>;
  label: string;
}

// @ts-ignore
@json
export class WasmInstantiate2Msg {
  admin: string | null;
  code_id: u64;
  label: string;
  msg: Uint8Array;
  funds: Array<Coin>;
  salt: Uint8Array;
}

// @ts-ignore
@json
export class WasmMigrateMsg {
  contract_addr: string;
  new_code_id: u64;
  msg: Uint8Array;
};

// @ts-ignore
@json
export class WasmUpdateAdminMsg {
  contract_addr: string;
  admin: string;
}

// @ts-ignore
@json
export class WasmClearAdminMsg {
  contract_addr: string
} 