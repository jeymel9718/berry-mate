export function generateSubarrays(array: any[], size: number) {
  const subarrays = [];
  for (let i = 0; i < array.length; i += size) {
    const subarray = array.slice(i, i + size);
    subarrays.push(subarray);
  }
  return subarrays;
}
