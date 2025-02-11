//
//
//

import { supabase } from "@/src/lib/supabase";

import {
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
} from "./types";

import {
  BUILD_vocabFilterQuery,
  BUILD_vocabSortingQuery,
  BUILD_vocabPaginationQuery,
  VALIDATE_args,
} from "./helpers";
import { TRANSFORM_errorInCatchBlock } from "@/src/utils/TRANSFORM_errorInCatchBlock/TRANSFORM_errorInCatchBlock";

export const function_NAME = "FETCH_myVocabs";

export async function FETCH_vocabs(
  args: FETCH_myVocabs_ARG_TYPES
): Promise<FETCH_myVocabs_RESPONSE_TYPE> {
  try {
    VALIDATE_args(args);

    let query = supabase
      .from("vocabs")
      .select(`*, list:lists (id,name)`, { count: "exact" });

    const filteredVocabCount_QUERY = BUILD_vocabFilterQuery(query, args);

    // ---------------------------------------------------
    const { error: count_ERR, count } =
      await filteredVocabCount_QUERY.abortSignal(args?.signal);

    if (count_ERR) throw count_ERR;

    // ---------------------------------------------------
    const filteredVocab_QUERY = BUILD_vocabFilterQuery(query, args, true);
    const sorted_QUERY = BUILD_vocabSortingQuery(filteredVocab_QUERY, args);
    const paginated_QUERY = BUILD_vocabPaginationQuery(sorted_QUERY, args);

    const { data, error } = await paginated_QUERY.abortSignal(args?.signal);
    if (error) throw error;

    // ---------------------------------------------------
    return {
      data: {
        vocabs: data || [],
        unpaginated_COUNT: count || 0,
      },
    };
  } catch (error: any) {
    return { error: TRANSFORM_errorInCatchBlock({ error, function_NAME }) };
  }
}
