import assert from "assert";
import { allocate, deallocate, memory } from "../build/debug.js";

const regionPtr = allocate(32);
const offset = new Uint32Array(memory.buffer.slice(regionPtr, regionPtr + 4))[0];
const capacity = new Uint32Array(memory.buffer.slice(regionPtr + 4, regionPtr + 8))[0];
const length = new Uint32Array(memory.buffer.slice(regionPtr + 8, regionPtr + 12))[0];

console.log(offset);
assert(capacity === 32);
assert(length === 0);

deallocate(offset);

console.log("ok!!!");