//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_lists_ARGS, ListQuery_TYPE } from "../../types";

const function_NAME = "BUILD_listPaginationQuery";

export function BUILD_listPaginationQuery(
  query: ListQuery_TYPE,
  args: FETCH_lists_ARGS
): ListQuery_TYPE {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  query = query.limit(args?.amount || 0);
  return query;
}
