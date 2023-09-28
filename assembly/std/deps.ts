import { Api, Querier, Storage } from "./abstracts"

export class Deps {
  storage: Storage;
  api: Api;
  querier: Querier ;

  constructor(storage: Storage, api: Api, querier: Querier) {
    this.storage = storage;
    this.api = api;
    this.querier = querier;
  }
}