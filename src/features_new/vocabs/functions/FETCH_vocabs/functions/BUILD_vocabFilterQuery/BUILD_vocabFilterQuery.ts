//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";

const function_NAME = "BUILD_vocabFilterQuery";

export function BUILD_vocabFilterQuery(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES,
  EXCLUDE_printed = false
): VocabQuery_TYPE {
  const {
    fetch_TYPE = "all",
    list_TYPE = "private",
    user_id = "",
    list_id = "",
    search = "",
    excludeIds = new Set(),
    filters = {
      byMarked: false,
      difficulties: [],
      langs: [],
    },
  } = args;

  if (!query)
    throw new General_ERROR({
      message: "'query' undefined when building vocab filters",
      function_NAME,
    });

  // Provide user_id if the vocabs are private
  if (list_TYPE === "private") {
    query = query.filter("user_id", "eq", user_id);
  }

  query = query.eq("type", list_TYPE);

  // Filter by the 'fetch_TYPE' provided
  switch (fetch_TYPE) {
    // Fetch all, non-deleted vocabs
    case "all":
      query = query.filter("deleted_at", "is", null);

      break;

    // Fetch non-deleted vocabs, that belong to a specific list
    case "byTargetList":
      query = query
        .filter("deleted_at", "is", null)
        .filter("list_id", "eq", list_id);
      break;

    // Fetch all deleted vocabs
    case "deleted":
      query = query.filter("deleted_at", "not.is", null);
      break;

    // Fetch non-deleted vocabs, that have been marked
    case "marked":
      query = query
        .filter("deleted_at", "is", null)
        .filter("is_marked", "eq", true);
      break;

    // Fetch all non-deleted vocabs by default
    default:
      query = query.filter("deleted_at", "is", null);
  }

  // ------------------------------------------------------
  const { langs = [], difficulties = [], byMarked = false } = filters;

  // Apply difficuty filters
  if (list_TYPE === "private" && difficulties.length > 0) {
    query = query.in("difficulty", difficulties);
  }

  // Apply lang filters
  if (langs.length > 0) {
    query = query.overlaps("lang_ids", langs);
  }

  // Apply marked filter
  if (list_TYPE === "private" && byMarked) {
    query = query.eq("is_marked", true);
  }
  // ------------------------------------------------------

  // Filter by search
  if (search) {
    query = query.or(
      `description.ilike.%${search}%,searchable.ilike.%${search}%`
    );
  }

  // Exclude certain vocab ids from the fetch
  if (EXCLUDE_printed) {
    query = query.filter(
      "id",
      "not.in",
      `(${Array.from(excludeIds).join(",")})`
    );
  }

  return query;
}
