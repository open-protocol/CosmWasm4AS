import { Api, Querier, Storage } from "./abstracts"

export class Deps<S extends Storage, A extends Api, Q extends Querier> {
  storage: S;
  api: A;
  querier: Q;

  constructor(storage: S, api: A, querier: Q) {
    this.storage = storage;
    this.api = api;
    this.querier = querier;
  }
}