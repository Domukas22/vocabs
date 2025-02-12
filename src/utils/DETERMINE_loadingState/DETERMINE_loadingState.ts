//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";

export default function DETERMINE_loadingState({
  search = "",
  targetList_ID = "",
  difficultyFilters = [],
  langFilters = [],
}: {
  search: string;
  targetList_ID: string | undefined;
  difficultyFilters?: number[];
  langFilters?: string[];
}): loadingState_TYPES {
  const HAS_filters = difficultyFilters?.length || langFilters?.length;

  if (search && HAS_filters) return "searching_and_filtering";
  if (search) return "searching";
  if (HAS_filters) return "filtering";
  if (targetList_ID) return "loading";
  return "none";
}
