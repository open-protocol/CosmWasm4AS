import { Region } from "./memory";

export function allocate(size: usize): u32 {
  return Region.alloc(size) as u32;
}

export function deallocate(pointer: u32): void {
  Region.consumeRegion(pointer);
}

