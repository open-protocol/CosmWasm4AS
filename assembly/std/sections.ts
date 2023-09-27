export class Sections {
  public static encodeSections(sections: Array<Uint8Array>): Uint8Array {
    let outLen = 0;
    for (let i = 0; i < sections.length; i++) {
      outLen += sections[i].byteLength;
    }
    outLen += (4 * sections.length);
    const outData = new Uint8Array(outLen);
    let outDataStart = outData.dataStart;
    for (let i = 0; i < sections.length; i++) {
      const sectionLen = new Uint32Array(1);
      sectionLen[0] = sections[i].byteLength;
      const sectionLenBuf = Uint8Array.wrap(sectionLen.buffer).reverse();
      outData.set(sections[i], outDataStart);
      outData.set(sectionLenBuf, outDataStart + sections[i].byteLength);
      outDataStart += sections[i].byteLength;
      outDataStart += sectionLenBuf.byteLength;
    }
    return outData;
  }
}
