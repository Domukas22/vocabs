//
//
//

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { FETCH_myVocabs_ARG_TYPES } from "../../types";

export function BUILD_vocabSortingQuery(
  query: PostgrestFilterBuilder<any, any, any[], "vocabs", unknown>,
  args: FETCH_myVocabs_ARG_TYPES
): PostgrestFilterBuilder<any, any, any[], "vocabs", unknown> {
  const sort_DIRECTION =
    args?.z_vocabDisplay_SETTINGS?.sortDirection === "ascending"
      ? "asc"
      : "desc";

  switch (args?.z_vocabDisplay_SETTINGS?.sorting) {
    case "difficulty":
      return query.order("difficulty", {
        ascending: sort_DIRECTION === "asc",
      });
    case "date":
      return query.order("created_at", { ascending: sort_DIRECTION === "asc" });
    default:
      return query.order("created_at", { ascending: sort_DIRECTION === "asc" });
  }
}
