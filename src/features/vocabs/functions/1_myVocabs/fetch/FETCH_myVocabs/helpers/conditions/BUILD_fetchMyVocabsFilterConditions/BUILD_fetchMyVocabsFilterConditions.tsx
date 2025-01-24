//
//
//

import { Q } from "@nozbe/watermelondb";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";
import GENERATE_internalError from "../../validation/GENERATE_internalError/GENERATE_internalError";
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

  const conditions = [Q.where("user_id", user_id)];

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

  if (settings.difficultyFilters?.length > 0) {
    conditions.push(Q.where("difficulty", Q.oneOf(settings.difficultyFilters)));
  }

  if (settings.langFilters?.length > 0) {
    conditions.push(
      Q.or(
        settings.langFilters.map((lang) =>
          Q.where("lang_ids", Q.like(`%${Q.sanitizeLikeString(lang)}%`))
        )
      )
    );
  }

  if (search) {
    conditions.push(
      Q.or([
        Q.where("description", Q.like(`%${Q.sanitizeLikeString(search)}%`)),
        Q.where("searchable", Q.like(`%${Q.sanitizeLikeString(search)}%`)),
      ])
    );
  }

  conditions.push(Q.where("id", Q.notIn([...excludeIds])));
  return Q.and(...conditions);
}
