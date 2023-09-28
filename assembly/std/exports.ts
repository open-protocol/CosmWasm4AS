import { Deps } from "./deps";
import { ExternalApi, ExternalQuerier, ExternalStorage } from "./imports";
import { Region } from "./memory";

export function allocate(size: usize): u32 {
  return Region.alloc(size) as u32;
}

export function deallocate(pointer: u32): void {
  Region.consumeRegion(pointer);
}

function makeDependencies(): Deps {
  return new Deps(new ExternalStorage(), new ExternalApi(), new ExternalQuerier());
}