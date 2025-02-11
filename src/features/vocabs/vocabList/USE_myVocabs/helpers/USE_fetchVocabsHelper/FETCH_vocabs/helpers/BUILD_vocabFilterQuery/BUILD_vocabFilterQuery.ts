//
//
//

import { FETCH_myVocabs_ARG_TYPES, VocabQuery_TYPE } from "../../types";
import { z_vocabDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export function BUILD_vocabFilterQuery(
  query: VocabQuery_TYPE,
  args: FETCH_myVocabs_ARG_TYPES,
  EXCLUDE_printed = false
): VocabQuery_TYPE {
  const {
    fetch_TYPE = "all",
    list_TYPE = "private",
    user_id = "",
    targetList_ID = "",
    search = "",
    excludeIds = new Set(),
    difficultyFilters = [],
    langFilters = [],
  } = args;

  // If fetching vocabs that belong to you
  if (list_TYPE === "private") {
    // Filter by the user id
    query = query.filter("user_id", "eq", user_id);

    // Filter by difficulty
    if (difficultyFilters.length > 0) {
      query = query.filter(
        "difficulty",
        "in",
        `(${difficultyFilters.join(",")})`
      );
    }
  }

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
        .filter("list_id", "eq", targetList_ID);
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

  // Filter by language (used as text search)
  if (langFilters.length > 0) {
    query = query.or(
      langFilters.map((lang) => `lang_ids.ilike.%${lang}%`).join(",")
    );
  }

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
