//
//
//

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { FETCH_lists_ARGS, ListQuery_TYPE } from "../../types";
import { BUILD_listFilterQuery } from "../BUILD_listFilterQuery/BUILD_listFilterQuery";
import { BUILD_listPaginationQuery } from "../BUILD_listPaginationQuery/BUILD_listPaginationQuery";
import { BUILD_listSortingQuery } from "../BUILD_listSortingQuery/BUILD_listSortingQuery";
import { General_ERROR } from "@/src/types/error_TYPES";
import { raw_List_TYPE } from "@/src/types/general_TYPES";

const function_NAME = "FETCH_finalLists";

export async function FETCH_finalLists(
  query: ListQuery_TYPE,
  args: FETCH_lists_ARGS
): Promise<{ lists: raw_List_TYPE[] }> {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  const filtered_QUERY = BUILD_listFilterQuery(query, args, true);
  const sorted_QUERY = BUILD_listSortingQuery(filtered_QUERY, args);
  const paginated_QUERY = BUILD_listPaginationQuery(sorted_QUERY, args);

  const { data, error } = await paginated_QUERY.abortSignal(args?.signal);
  if (error)
    throw new General_ERROR({
      message: error?.message,
      function_NAME,
      errorToSpread: error,
    });

  return { lists: data || [] };
}
