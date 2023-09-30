import { JSON } from "json-as/assembly";

// @ts-ignore
@json
export class Coin {
  denom: string;
  amount: string;
}