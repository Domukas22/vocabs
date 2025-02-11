//
//
//

import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";
import { BUILD_vocabFilterQuery } from "../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery";

export async function FETCH_unpaginatedVocabCount(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): Promise<{ unpaginated_COUNT: number }> {
  if (!query)
    throw new Error("'query' undefined when fetching unpaginated vocab count");

  const filteredVocabCount_QUERY = BUILD_vocabFilterQuery(query, args);
  const { error: count_ERR, count } =
    await filteredVocabCount_QUERY.abortSignal(args?.signal);

  if (count_ERR) throw count_ERR;
  return { unpaginated_COUNT: count || 0 };
}
