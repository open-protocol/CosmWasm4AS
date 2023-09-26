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
}