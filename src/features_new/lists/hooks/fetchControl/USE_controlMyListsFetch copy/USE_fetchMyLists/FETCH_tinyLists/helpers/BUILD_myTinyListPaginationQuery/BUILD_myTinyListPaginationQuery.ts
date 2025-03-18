//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myTinyLists_ARGS, MyTinyListQuery_TYPE } from "../../types";

const function_NAME = "BUILD_myTinyListPaginationQuery";

export function BUILD_myTinyListPaginationQuery(
  query: MyTinyListQuery_TYPE,
  args: FETCH_myTinyLists_ARGS
): MyTinyListQuery_TYPE {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  query = query.limit(args?.amount || 0);
  return query;
}
