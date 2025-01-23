//
//
//

export function CONVERT_TimestampzToReadableDate(timestampz: string): string {
  const date = new Date(timestampz);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${day}. ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}
