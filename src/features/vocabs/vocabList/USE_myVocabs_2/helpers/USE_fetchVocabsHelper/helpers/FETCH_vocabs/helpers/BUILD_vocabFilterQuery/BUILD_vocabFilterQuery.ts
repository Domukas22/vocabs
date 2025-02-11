//
//
//

import { FETCH_myVocabs_ARG_TYPES } from "../../types";
import { z_vocabDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

export function BUILD_vocabFilterQuery(
  query: PostgrestFilterBuilder<any, any, any[], "vocabs", unknown>,
  args: FETCH_myVocabs_ARG_TYPES,
  EXCLUDE_printed = false
): PostgrestFilterBuilder<any, any, any[], "vocabs", unknown> {
  const {
    fetch_TYPE = "all",
    list_TYPE = "private",
    user_id = "",
    targetList_ID = "",
    search = "",
    excludeIds = new Set(),
    z_vocabDisplay_SETTINGS = {} as z_vocabDisplaySettings_PROPS,
  } = args;

  const { difficultyFilters = [], langFilters = [] } = z_vocabDisplay_SETTINGS;

  // If fetching vocabs that belong to you
  if (list_TYPE === "private") {
    // filter by user
    query = query.filter("user_id", "eq", user_id);

    // filter by difficulty
    if (difficultyFilters.length > 0) {
      query = query.filter(
        "difficulty",
        "in",
        `(${difficultyFilters.join(",")})`
      );
    }
  }

  // Filter by fetch_TYPE
  switch (fetch_TYPE) {
    case "all":
      query = query.filter("deleted_at", "is", null);

      break;
    case "byTargetList":
      query = query
        .filter("deleted_at", "is", null)
        .filter("list_id", "eq", targetList_ID);

      break;
    case "deleted":
      query = query.filter("deleted_at", "not.is", null);

      break;
    case "marked":
      query = query
        .filter("deleted_at", "is", null)
        .filter("is_marked", "eq", true);

      break;
    default:
      query = query.filter("deleted_at", "is", null);
  }

  // Add language filters (used as text search)
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

  if (EXCLUDE_printed) {
    query = query.filter(
      "id",
      "not.in",
      `(${Array.from(excludeIds).join(",")})`
    );
  }

  return query;
}
