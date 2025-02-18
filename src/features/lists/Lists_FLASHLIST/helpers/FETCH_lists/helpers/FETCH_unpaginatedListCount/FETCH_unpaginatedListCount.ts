//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_lists_ARGS, ListQuery_TYPE } from "../../types";
import { BUILD_listFilterQuery } from "../BUILD_listFilterQuery/BUILD_listFilterQuery";

const function_NAME = "FETCH_unpaginatedVocabCount";

export async function FETCH_unpaginatedListCount(
  query: ListQuery_TYPE,
  args: FETCH_lists_ARGS
): Promise<{ unpaginated_COUNT: number }> {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  const filtered_QUERY = BUILD_listFilterQuery(query, args);
  const { error, count } = await filtered_QUERY.abortSignal(args?.signal);

  if (error)
    throw new General_ERROR({
      message: error?.message,
      function_NAME,
      errorToSpread: error,
    });

  return { unpaginated_COUNT: count || 0 };
}
