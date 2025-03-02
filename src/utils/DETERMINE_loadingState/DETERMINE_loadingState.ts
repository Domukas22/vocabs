//
//
//

import { Filters_TYPE, loadingState_TYPES } from "@/src/types/general_TYPES";

export default function DETERMINE_loadingState({
  search = "",
  loadMore = false,
  HAS_filters = false,
}: {
  search: string;
  loadMore: boolean;
  HAS_filters: boolean;
}): loadingState_TYPES {
  if (loadMore) return "loading_more";
  if (search && HAS_filters) return "searching_and_filtering";
  if (search) return "searching";
  if (HAS_filters) return "filtering";
  return "loading";
}
