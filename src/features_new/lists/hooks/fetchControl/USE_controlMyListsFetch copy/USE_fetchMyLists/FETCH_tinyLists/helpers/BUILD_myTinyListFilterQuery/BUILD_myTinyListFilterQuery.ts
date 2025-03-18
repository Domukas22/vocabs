//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myTinyLists_ARGS, MyTinyListQuery_TYPE } from "../../types";

const function_NAME = "BUILD_myTinyListFilterQuery";

export function BUILD_myTinyListFilterQuery(
  query: MyTinyListQuery_TYPE,
  args: FETCH_myTinyLists_ARGS,
  EXCLUDE_printed = false
): MyTinyListQuery_TYPE {
  const { user_id = "", search = "", excludeIds = new Set() } = args;

  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  // filter by type
  query = query.eq("type", "private");
  query = query.eq("user_id", user_id);
  query = query.or(`name.ilike.%${search}%`);

  // ------------------------------------------------------
  // Exclude lists that have already been printed
  if (EXCLUDE_printed) {
    query = query.filter(
      "id",
      "not.in",
      `(${Array.from(excludeIds).join(",")})`
    );
  }

  return query;
}
