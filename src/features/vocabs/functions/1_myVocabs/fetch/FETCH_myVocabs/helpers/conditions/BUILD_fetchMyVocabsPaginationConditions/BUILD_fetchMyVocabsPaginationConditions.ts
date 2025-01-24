//
//
//

import { Q } from "@nozbe/watermelondb";
import { FETCH_myVocabs_ARG_TYPES } from "../../../types";

export default function BUILD_fetchMyVocabsPaginationConditions(
  args: FETCH_myVocabs_ARG_TYPES
) {
  const IS_validStart = typeof args?.start === "number";
  const IS_validAmount = typeof args?.amount === "number";
  const WILL_fetchAtLeastOne =
    typeof args?.amount === "number" && args?.amount > 0;

  // If either start or amount is invalid, or amount <= 0, select nothing
  if (
    !IS_validStart ||
    !IS_validAmount ||
    !WILL_fetchAtLeastOne ||
    !args.amount
  ) {
    return [Q.take(0)];
  }

  // If inputs are valid, apply the conditions
  return [Q.skip(args.start), Q.take(args.amount)];
}
