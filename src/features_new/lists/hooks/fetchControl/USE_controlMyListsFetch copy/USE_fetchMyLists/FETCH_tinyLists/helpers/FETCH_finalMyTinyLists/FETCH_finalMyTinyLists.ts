//
//
//

import { FETCH_myTinyLists_ARGS, MyTinyListQuery_TYPE } from "../../types";
import { BUILD_myTinyListFilterQuery } from "../BUILD_myTinyListFilterQuery/BUILD_myTinyListFilterQuery";
import { BUILD_myTinyListPaginationQuery } from "../BUILD_myTinyListPaginationQuery/BUILD_myTinyListPaginationQuery";
import { General_ERROR } from "@/src/types/error_TYPES";
import { TinyList_TYPE } from "@/src/features_new/lists/types";
import { BUILD_myTinyListSortingQuery } from "../BUILD_myTinyListSortingQuery/BUILD_myTinyListSortingQuery";

const function_NAME = "FETCH_finalMyTinyLists";

export async function FETCH_finalMyTinyLists(
  query: MyTinyListQuery_TYPE,
  args: FETCH_myTinyLists_ARGS
): Promise<{ tiny_LISTS: TinyList_TYPE[] }> {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  const filtered_QUERY = BUILD_myTinyListFilterQuery(query, args, true);
  const sorted_QUERY = BUILD_myTinyListSortingQuery(filtered_QUERY);
  const paginated_QUERY = BUILD_myTinyListPaginationQuery(sorted_QUERY, args);

  const { data, error } = await paginated_QUERY.abortSignal(args?.signal);
  if (error)
    throw new General_ERROR({
      message: error?.message,
      function_NAME,
      errorToSpread: error,
    });

  return { tiny_LISTS: data || [] };
}
