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