import { JSON } from "json-as/assembly";

// @ts-ignore
@json
export class Event {
  type: string;
  attributes: Array<Attribute>;
}

// @ts-ignore
@json
export class Attribute {
  key: string;
  value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
}