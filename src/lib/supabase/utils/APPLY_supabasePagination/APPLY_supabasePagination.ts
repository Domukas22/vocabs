//
//
//

export default function APPLY_supabasePagination(
  query: any,
  start: number,
  end: number
) {
  return end - 1 <= start ? query.range(0, 0) : query.range(start, end - 1);
}
