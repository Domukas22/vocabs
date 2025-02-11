//
//
//

import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { VocabQuery_TYPE, FETCH_myVocabs_ARG_TYPES } from "../../types";
import { BUILD_vocabFilterQuery } from "../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery";
import { BUILD_vocabPaginationQuery } from "../BUILD_vocabPaginationQuery/BUILD_vocabPaginationQuery";
import { BUILD_vocabSortingQuery } from "../BUILD_vocabSortingQuery/BUILD_vocabSortingQuery";

export async function FETCH_finalVocabs(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): Promise<{ vocabs: Vocab_MODEL[] }> {
  if (!query) throw new Error("'query' undefined when fetching final vocabs");

  const filtered_QUERY = BUILD_vocabFilterQuery(query, args, true);
  const sorted_QUERY = BUILD_vocabSortingQuery(filtered_QUERY, args);
  const paginated_QUERY = BUILD_vocabPaginationQuery(sorted_QUERY, args);

  const { data, error } = await paginated_QUERY.abortSignal(args?.signal);
  if (error) throw error;

  return { vocabs: data || [] };
}
