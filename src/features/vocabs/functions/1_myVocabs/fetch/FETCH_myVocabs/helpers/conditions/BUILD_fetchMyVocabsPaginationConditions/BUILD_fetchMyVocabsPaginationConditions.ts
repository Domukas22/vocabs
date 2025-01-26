//
//
//

import { Q } from "@nozbe/watermelondb";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";

export default function BUILD_fetchMyVocabsPaginationConditions(
  args: FETCH_myVocabs_ARG_TYPES
) {
  return Q.take(args?.amount || 0);
}
