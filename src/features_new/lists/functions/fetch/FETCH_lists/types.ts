//
//
//

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { List_TYPE } from "../../../types";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";
import { myListsSorting_TYPE } from "../../../hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";

export type listFetch_TYPES = "byTargetList" | "all";
export type listSorting_TYPES = "date" | "vocab-count" | "saved-count";

export interface FETCH_lists_ARGS {
  search: string;
  user_id: string;
  list_id: string;
  list_TYPE: itemVisibility_TYPE;
  fetch_TYPE: listFetch_TYPES;
  langFilters: string[];
  sorting: listSorting_TYPES;
  sortDirection: "ascending" | "descending";
  amount: number;
  excludeIds: Set<string>;
  signal: AbortSignal;
  difficulty_FILTERS: (1 | 2 | 3)[];
  SHOULD_filterByMarked: boolean;
}

export type FETCH_lists_RESPONSE_TYPE = {
  lists: List_TYPE[];
  unpaginated_COUNT: number;
};

export type ListQuery_TYPE = PostgrestFilterBuilder<
  any,
  any,
  any[],
  "lists_extended",
  unknown
>;
