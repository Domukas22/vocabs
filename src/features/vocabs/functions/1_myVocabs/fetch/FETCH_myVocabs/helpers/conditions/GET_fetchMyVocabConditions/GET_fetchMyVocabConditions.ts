//
//
//

import { FETCH_myVocabs_ARG_TYPES } from "../../../types";
import BUILD_fetchMyVocabsFilterConditions from "../BUILD_fetchMyVocabsFilterConditions/BUILD_fetchMyVocabsFilterConditions";
import BUILD_fetchMyVocabsPaginationConditions from "../BUILD_fetchMyVocabsPaginationConditions/BUILD_fetchMyVocabsPaginationConditions";
import BUILD_fetchMyVocabsSortingConditions from "../BUILD_fetchMyVocabsSortingConditions/BUILD_fetchMyVocabsSortingConditions";

export function GET_fetchMyVocabConditions(args: FETCH_myVocabs_ARG_TYPES) {
  const filter_CONDITIONS = BUILD_fetchMyVocabsFilterConditions(args);
  const sorting_CONDITIONS = BUILD_fetchMyVocabsSortingConditions(args);
  const pagination_CONDITIONS = BUILD_fetchMyVocabsPaginationConditions(args);

  return { filter_CONDITIONS, sorting_CONDITIONS, pagination_CONDITIONS };
}
