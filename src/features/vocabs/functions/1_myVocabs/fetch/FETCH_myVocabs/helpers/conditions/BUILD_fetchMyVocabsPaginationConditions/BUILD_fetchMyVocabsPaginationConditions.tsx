//
//
//

import { Q } from "@nozbe/watermelondb";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";

export default function BUILD_fetchMyVocabsPaginationConditions(
  args: FETCH_myVocabs_ARG_TYPES
) {
  const conditions = (Q.skip(args?.start || 0), Q.take(args?.amount || 10));

  return conditions;
}
