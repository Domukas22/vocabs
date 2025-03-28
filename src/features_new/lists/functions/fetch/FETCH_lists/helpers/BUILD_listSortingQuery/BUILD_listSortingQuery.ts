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

  const { direction, type } = args.sorting;

  const SHOULD_ascend = direction === "ascending";

  if (type === "date") {
    return query.order("created_at", { ascending: SHOULD_ascend });
  }

  if (type === "vocab-count") {
    return query.order("vocab_infos->>total", { ascending: !SHOULD_ascend });
  }

  if (type === "saved-count") {
    return query.order("saved_count", { ascending: !SHOULD_ascend });
  }

  return query;
}
