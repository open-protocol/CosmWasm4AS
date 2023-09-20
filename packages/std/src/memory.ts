export class Region {
  constructor(public offset: u32, public capacity: u32, public length: u32) { }

  public static alloc(size: usize): usize {
    const dataPtr = heap.alloc(size);
    if (!isInteger<u32>(dataPtr)) {
      throw new Error("pointer doesn't fit in u32");
    }   
    if (!isInteger<u32>(size)) {
      throw new Error("capacity doesn't fit in u32");
    }
    return this.buildRegionFromComponents(dataPtr, size, 0);
  }

  public static buildRegion(data: Uint8Array): usize {
    const dataPtr = heap.alloc(data.byteLength);
    if (!isInteger<u32>(dataPtr)) {
      throw new Error("pointer doesn't fit in u32");
    }   
    if (!isInteger<u32>(data.byteLength)) {
      throw new Error("length doesn't fit in u32");
    }
    memory.copy(dataPtr, data.byteOffset, data.byteLength);
    return this.buildRegionFromComponents(dataPtr, data.byteLength, data.byteLength);
  }

  static buildRegionFromComponents(offset: u32, capacity: u32, length: u32): usize {
    const regionPtr = heap.alloc(12);
    store<u32>(regionPtr, offset);
    store<u32>(regionPtr + 4, capacity);
    store<u32>(regionPtr + 8, length);
    return regionPtr;
  }
}
