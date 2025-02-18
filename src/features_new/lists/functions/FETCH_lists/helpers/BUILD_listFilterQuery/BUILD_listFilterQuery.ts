//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_lists_ARGS, ListQuery_TYPE } from "../../types";

const function_NAME = "BUILD_listFilterQuery";

export function BUILD_listFilterQuery(
  query: ListQuery_TYPE,
  args: FETCH_lists_ARGS,
  EXCLUDE_printed = false
): ListQuery_TYPE {
  const {
    list_TYPE = "private",
    user_id = "",

    search = "",
    excludeIds = new Set(),

    langFilters = [],
  } = args;

  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  // filter by type
  query = query.eq("type", list_TYPE);

  // filter by user id if private
  if (list_TYPE === "private") {
    query = query.eq("user_id", user_id);
  }

  // filter by search
  if (search) {
    if (list_TYPE === "public") {
      // search by name AND description if it's a public list fetch
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    } else {
      // search by ONLY by name if it's a private list fetch
      query = query.or(`name.ilike.%${search}%`);
    }
  }

  // filter by lang
  if (langFilters?.length) {
    query = query.or(
      langFilters.map((lang) => `collected_lang_ids.ilike.%${lang}%`).join(",")
    );
  }

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
