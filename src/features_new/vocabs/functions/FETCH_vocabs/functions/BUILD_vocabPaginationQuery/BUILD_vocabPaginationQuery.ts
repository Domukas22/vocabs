//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";

const function_NAME = "BUILD_vocabPaginationQuery";

export function BUILD_vocabPaginationQuery(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): VocabQuery_TYPE {
  if (!query)
    throw new General_ERROR({
      message: "'query' undefined when building vocab pagination",
      function_NAME,
    });

  query = query.limit(args?.amount || 0);
  return query;
}
