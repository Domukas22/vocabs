//
//
//

import { FETCH_myVocabs_ARG_TYPES } from "../../types";

export function VALIDATE_args(args: FETCH_myVocabs_ARG_TYPES) {
  const { fetch_TYPE, user_id, targetList_ID, z_vocabDisplay_SETTINGS } = args;

  if (!user_id) {
    throw { message: "User id undefined" };
  }

  if (!fetch_TYPE) {
    throw { message: "User id undefined" };
  }

  if (fetch_TYPE === "byTargetList" && !targetList_ID)
    throw { message: "targetList_ID undefined" };

  if (!z_vocabDisplay_SETTINGS) throw { message: "Display settings undefined" };

  if (typeof args?.amount !== "number")
    throw { message: "Pagination amount undefined" };
}
