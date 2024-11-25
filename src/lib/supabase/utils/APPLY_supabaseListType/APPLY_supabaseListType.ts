//
//
//

export default function APPLY_supabaseListType(
  query: any,
  type: string,
  list_ids: string[] | undefined | null
) {
  if (type !== "shared" && type !== "public")
    return query.eq("type", "typeUndefined");

  query = query.eq("type", type);

  if (type === "shared" && list_ids && list_ids?.length > 0) {
    query = query.in("id", list_ids);
  }

  return query;
}
