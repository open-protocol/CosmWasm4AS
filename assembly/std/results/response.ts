import { CosmosMsg } from "./cosmos_msg";
import { Attribute, Event } from "./events";
import { SubMsg } from "./submessages";

// @ts-ignore
@json
export class Response {
  messages: Array<SubMsg>;
  attributes: Array<Attribute>;
  events: Array<Event>;
  data: Uint8Array | null;

  constructor() {
    this.messages = new Array();
    this.attributes = new Array();
    this.events = new Array();
    this.data = null;
  }

  public addAttribute(key: string, value: string): Response {
    this.attributes.push(new Attribute(key, value));
    return this;
  }

  public addMessage(msg: CosmosMsg): Response {
    this.messages.push(SubMsg.replyNever(msg));
    return this;
  }

  public addSubmessage(msg: SubMsg): Response {
    this.messages.push(msg);
    return this;
  }

  public addEvent(event: Event): Response {
    this.events.push(event);
    return this;
  }

  public addMessages(msgs: Array<CosmosMsg>): Response {
    this.addSubmessages(msgs.map(SubMsg.replyNever));
    return this;
  }

  public addSubmessages(msgs: Array<SubMsg>): Response {
    this.messages = this.messages.concat(msgs);
    return this;
  }

  public addEvents(events: Array<Event>): Response {
    this.events = this.events.concat(events);
    return this;
  }

  public setData(data: Uint8Array): Response {
    this.data = data;
    return this;
  }
}