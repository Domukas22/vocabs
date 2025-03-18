//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { MyTinyListQuery_TYPE } from "../../types";

const function_NAME = "BUILD_myTinyListSortingQuery";

export function BUILD_myTinyListSortingQuery(
  query: MyTinyListQuery_TYPE
): MyTinyListQuery_TYPE {
  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  return query.order("created_at", { ascending: false });
}
