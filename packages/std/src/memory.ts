export class Region {
  constructor(public offset: u32, public capacity: u32, public length: u32) { }

  public static alloc(size: usize): usize {
    const dataPtr = heap.alloc(size);
    return this.buildRegionFromComponents(dataPtr as u32, size as u32, 0);
  }

  public static consumeRegion(ptr: usize): Uint8Array {
    const regionStart = load<u32>(ptr);
    const length = load<u32>(ptr + 4);
    const capacity = load<u32>(ptr + 8);
    const data = new Uint8Array(capacity);
    memory.copy(data.byteOffset, regionStart, length);
    heap.free(regionStart);
    return data;
  }

  public static buildRegion(data: Uint8Array): usize {
    const dataPtr = heap.alloc(data.byteLength);
    memory.copy(dataPtr, data.byteOffset, data.byteLength);
    return this.buildRegionFromComponents(dataPtr as u32, data.byteLength, data.byteLength);
  }

  static buildRegionFromComponents(offset: u32, capacity: u32, length: u32): usize {
    const regionPtr = heap.alloc(12);
    store<u32>(regionPtr, offset);
    store<u32>(regionPtr + 4, capacity);
    store<u32>(regionPtr + 8, length);
    return regionPtr;
  }
}
