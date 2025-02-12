//
//
//

import { Error_PROPS } from "@/src/types/error_TYPES";

export default function APPLY_supabaseListType(
  query: any,
  type: string,
  list_ids: string[] | undefined | null
): { query?: any; error?: Error_PROPS } {
  if (type !== "shared" && type !== "public")
    return query.eq("type", "typeUndefined");

  query = query.eq("type", type);

  if (type === "shared" && list_ids && list_ids?.length > 0) {
    query = query.in("id", list_ids);
  }

  return query;
}
