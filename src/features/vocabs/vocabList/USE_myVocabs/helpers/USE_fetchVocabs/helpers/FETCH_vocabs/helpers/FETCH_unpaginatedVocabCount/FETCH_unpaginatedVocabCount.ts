//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";
import { BUILD_vocabFilterQuery } from "../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery";

const function_NAME = "FETCH_unpaginatedVocabCount";

export async function FETCH_unpaginatedVocabCount(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): Promise<{ unpaginated_COUNT: number }> {
  if (!query)
    throw new General_ERROR({
      message: "'query' undefined when fetching unpaginated vocab count",
      function_NAME,
    });

  const filteredVocabCount_QUERY = BUILD_vocabFilterQuery(query, args);
  const { error: count_ERR, count } =
    await filteredVocabCount_QUERY.abortSignal(args?.signal);

  if (count_ERR)
    throw new General_ERROR({
      message: count_ERR?.message,
      function_NAME,
      errorToSpread: { ...count_ERR, function_NAME },
    });

  return { unpaginated_COUNT: count || 0 };
}
