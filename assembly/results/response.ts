import { Attribute, Event } from "./events";
import { SubMsg } from "./submessages";

// @ts-ignore
@json
export class Response {
  messages: Array<SubMsg>;
  attributes: Array<Attribute>;
  events: Array<Event>;
  data: Uint8Array | null;
}