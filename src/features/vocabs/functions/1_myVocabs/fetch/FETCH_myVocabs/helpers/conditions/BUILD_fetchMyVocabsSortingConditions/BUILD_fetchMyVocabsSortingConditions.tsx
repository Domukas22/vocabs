//
//
//

import { Q } from "@nozbe/watermelondb";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";

export default function BUILD_fetchMyVocabsSortingConditions(
  args: FETCH_myVocabs_ARG_TYPES
) {
  const sort_DIRECTION =
    args?.z_vocabDisplay_SETTINGS.sortDirection === "ascending"
      ? Q.asc
      : Q.desc;

  switch (args?.z_vocabDisplay_SETTINGS.sorting) {
    case "difficulty":
      return Q.sortBy("difficulty", sort_DIRECTION);
    case "date":
      return Q.sortBy("created_at", sort_DIRECTION);
    default:
      return Q.sortBy("created_at", sort_DIRECTION);
  }
}
