//
//
//

import { FETCH_myVocabs_ARG_TYPES } from "../../types";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export function BUILD_vocabPaginationQuery(
  query: PostgrestFilterBuilder<any, any, any[], "vocabs", unknown>,
  args: FETCH_myVocabs_ARG_TYPES
): PostgrestFilterBuilder<any, any, any[], "vocabs", unknown> {
  query = query.limit(args?.amount || 0);
  return query;
}
