//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_lists_ARGS, ListQuery_TYPE } from "../../types";

const function_NAME = "BUILD_listSortingQuery";

export function BUILD_listSortingQuery(
  query: ListQuery_TYPE,
  args: FETCH_lists_ARGS
): ListQuery_TYPE {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  const SHOULD_ascend = args?.sortDirection === "ascending";

  return query.order("created_at", { ascending: SHOULD_ascend });
}
