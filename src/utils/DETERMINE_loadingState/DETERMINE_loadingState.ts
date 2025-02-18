//
//
//

import { loadingState_TYPES } from "@/src/types/general_TYPES";

export default function DETERMINE_loadingState({
  search = "",
  loadMore = false,
  difficultyFilters = [],
  langFilters = [],
}: {
  search: string;
  loadMore: boolean;
  difficultyFilters?: number[];
  langFilters?: string[];
}): loadingState_TYPES {
  const HAS_filters = difficultyFilters?.length || langFilters?.length;

  if (loadMore) return "loading_more";
  if (search && HAS_filters) return "searching_and_filtering";
  if (search) return "searching";
  if (HAS_filters) return "filtering";
  return "loading";
}
