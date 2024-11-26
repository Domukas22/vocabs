//
//
//

export default function APPLY_supabasePagination(
  query: any,
  start: number,
  end: number
) {
  if (!query) return;

  const validNumbers = typeof end === "number" && typeof start === "number";

  return validNumbers && end - 1 <= start
    ? query.range(0, 0)
    : query.range(start, end - 1);
}
