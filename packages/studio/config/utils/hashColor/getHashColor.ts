export const getColorForType = (type: string): string => {
  const hash = hashCode(type);
  return getColorFromHash(hash);
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash;
}

function getColorFromHash(hash: number): string {
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return `rgb(${r},${g},${b})`;
}
