//
//
//

import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";

export function BUILD_vocabPaginationQuery(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): VocabQuery_TYPE {
  query = query.limit(args?.amount || 0);
  return query;
}
