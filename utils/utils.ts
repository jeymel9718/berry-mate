export function generateSubarrays(array: any[], size: number) {
  const subarrays = [];
  for (let i = 0; i < array.length; i += size) {
    const subarray = array.slice(i, i + size);
    subarrays.push(subarray);
  }
  return subarrays;
}

export const formatTransactionDate = (timestamp: number | string | Date): string => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" }); // e.g., March
  const day = date.getDate();

  return `${hours}:${minutes} - ${month} ${day}`;
};

/**
 * Convert HSL to HEX color string
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  s /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
  const toHex = (x: number) =>
    Math.round(x * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

/**
 * Hash a string to a 32-bit integer
 */
function stringToHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0; // 32-bit integer
  }
  return hash;
}

/**
 * Get a unique HEX color for a given label/category.
 */
export function getUniquePieColor(label: string): string {
  const hash = stringToHash(label);
  const hue = Math.abs(hash) % 360;               // 0 - 359
  const saturation = 65 + (Math.abs(hash) % 20);  // 65% - 85%
  const lightness = 45 + (Math.abs(hash) % 10);   // 45% - 55%
  return hslToHex(hue, saturation, lightness);
}
