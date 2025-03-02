//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";

const function_NAME = "BUILD_vocabSortingQuery";

export function BUILD_vocabSortingQuery(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): VocabQuery_TYPE {
  if (!query)
    throw new General_ERROR({
      message: "'query' undefined when building vocab sorting",
      function_NAME,
    });

  const { direction = "descending", type = "date" } = args?.sorting;
  const SHOULD_ascend = direction === "ascending";

  if (type === "date") {
    return query.order("created_at", { ascending: SHOULD_ascend });
  }

  if (type === "difficulty") {
    return query.order("difficulty", { ascending: SHOULD_ascend });
  }

  if (type === "saved-count") {
    return query.order("saved_count", { ascending: SHOULD_ascend });
  }

  if (type === "marked") {
    return query.order("is_marked", { ascending: SHOULD_ascend });
  }

  return query;
}
