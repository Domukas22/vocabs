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
    list_id = "",
    search = "",
    excludeIds = new Set(),
    fetch_TYPE = "all",
    filters = {
      byMarked: false,
      difficulties: [],
      langs: [],
    },
  } = args;

  if (!query)
    throw new General_ERROR({
      message: "'query' was undefined",
      function_NAME,
    });

  // filter by type
  query = query.eq("type", list_TYPE);

  // filter by user id if private
  if (list_TYPE !== "public") {
    query = query.eq("user_id", user_id);
  }

  // Filter by the 'fetch_TYPE' provided
  switch (fetch_TYPE) {
    // Fetch all lists
    case "all":
      // nothing to do
      break;

    // Fetch non-deleted vocabs, that belong to a specific list
    case "byTargetList":
      query = query.filter("id", "eq", list_id);
      break;
  }

  // ------------------------------------------------------
  const { langs = [], difficulties = [], byMarked = false } = filters;

  // // Apply difficulty filters
  if (list_TYPE === "private" && difficulties.length > 0) {
    difficulties.forEach((diff) => {
      query = query.gt(`vocab_infos->>diff_${diff}`, 0);
    });
  }

  // // Apply lang filters
  if (langs.length > 0) {
    query = query.overlaps("collected_lang_ids", langs);
  }

  // Apply marked filter
  if (list_TYPE === "private" && byMarked) {
    query = query.gt("vocab_infos->>marked", 0);
  }

  // ------------------------------------------------------

  // filter by search
  if (search) {
    if (list_TYPE !== "private") {
      // search by name AND description if it's a public list fetch
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    } else {
      // search by ONLY by name if it's a private list fetch
      query = query.or(`name.ilike.%${search}%`);
    }
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
