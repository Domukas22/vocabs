//
//
//

import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";

export function BUILD_vocabSortingQuery(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): VocabQuery_TYPE {
  if (!query) throw new Error("'query' undefined when building vocab sorting");

  const sort_DIRECTION = args?.sortDirection === "ascending" ? "asc" : "desc";

  switch (args?.sorting) {
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
