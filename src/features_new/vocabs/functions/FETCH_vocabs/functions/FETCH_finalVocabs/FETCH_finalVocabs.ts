//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { VocabQuery_TYPE, FETCH_myVocabs_ARG_TYPES } from "../../types";
import { BUILD_vocabFilterQuery } from "../BUILD_vocabFilterQuery/BUILD_vocabFilterQuery";
import { BUILD_vocabPaginationQuery } from "../BUILD_vocabPaginationQuery/BUILD_vocabPaginationQuery";
import { BUILD_vocabSortingQuery } from "../BUILD_vocabSortingQuery/BUILD_vocabSortingQuery";
import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

const function_NAME = "FETCH_finalVocabs";

export async function FETCH_finalVocabs(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES
): Promise<{ vocabs: Vocab_TYPE[] }> {
  if (!query)
    throw new General_ERROR({
      message: "'query' undefined when fetching final vocabs",
      function_NAME,
    });

  // if shuffle, do the filtering on supabase
  if (args.sorting?.type === "shuffle") {
    const {
      user_id,
      fetch_TYPE,
      list_TYPE,
      list_id,
      search,
      excludeIds,
      filters: { byMarked, difficulties, langs },
    } = args;

    const { data, error } = await supabase.rpc("fetch_filtered_random_vocabs", {
      list_type: list_TYPE,
      fetch_type: fetch_TYPE,
      user_uuid: user_id || null,
      list_uuid: list_id || null,
      search_text: search,
      exclude_ids: Array.from(excludeIds) || [],
      marked: byMarked,
      difficulties,
      langs,
    });

    if (error)
      throw new General_ERROR({
        message: error?.message,
        function_NAME,
        errorToSpread: { ...error, function_NAME },
      });

    return { vocabs: data || [] };
  }

  const filtered_QUERY = BUILD_vocabFilterQuery(query, args, true);
  const sorted_QUERY = BUILD_vocabSortingQuery(filtered_QUERY, args);
  const paginated_QUERY = BUILD_vocabPaginationQuery(sorted_QUERY, args);

  const { data, error } = await paginated_QUERY.abortSignal(args?.signal);
  if (error)
    throw new General_ERROR({
      message: error?.message,
      function_NAME,
      errorToSpread: { ...error, function_NAME },
    });

  return { vocabs: data || [] };
}
