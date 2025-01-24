//
//
//

import { Q } from "@nozbe/watermelondb";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";
import { z_vocabDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";

export default function BUILD_fetchMyVocabsFilterConditions(
  args: FETCH_myVocabs_ARG_TYPES
) {
  const {
    type = "allVocabs",
    user_id = "",
    targetList_ID = "",
    search = "",
    excludeIds = new Set(),
    z_vocabDisplay_SETTINGS: settings = {} as z_vocabDisplaySettings_PROPS,
  } = args;

  const { difficultyFilters = [], langFilters = [] } = settings;

  const conditions = [];

  // filter by user
  conditions.push(Q.where("user_id", user_id));

  // filter by type
  switch (type) {
    case "allVocabs":
      conditions.push(Q.where("deleted_at", null));
      break;
    case "byTargetList":
      conditions.push(
        Q.where("deleted_at", null),
        Q.where("list_id", targetList_ID)
      );
      break;
    case "deletedVocabs":
      conditions.push(Q.where("deleted_at", notEq(null)));
      break;
    case "marked":
      conditions.push(Q.where("deleted_at", null), Q.where("is_marked", true));
      break;
    default:
      conditions.push(Q.where("deleted_at", null));
  }

  // add difficulty filters
  if (difficultyFilters?.length > 0) {
    conditions.push(Q.where("difficulty", Q.oneOf(difficultyFilters)));
  }

  // add language filters
  if (langFilters?.length > 0) {
    conditions.push(
      Q.or(
        langFilters.map((lang) =>
          Q.where("lang_ids", Q.like(`%${Q.sanitizeLikeString(lang)}%`))
        )
      )
    );
  }

  // filter by search
  if (search) {
    const sanitized_SEARCH = Q.like(`%${Q.sanitizeLikeString(search)}%`);

    conditions.push(
      Q.or([
        Q.where("description", sanitized_SEARCH),
        Q.where("searchable", sanitized_SEARCH),
      ])
    );
  }

  // exclude certain ids
  if (excludeIds.size > 0) {
    conditions.push(Q.where("id", Q.notIn([...excludeIds])));
  }

  return Q.and(...conditions);
}
