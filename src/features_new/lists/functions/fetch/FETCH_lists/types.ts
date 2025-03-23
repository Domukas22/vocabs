//
//
//

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { List_TYPE, ListFilter_PROPS } from "../../../types";
import {
  privateOrPublic_TYPE,
  sortDirection_TYPE,
} from "@/src/types/general_TYPES";

export type listFetch_TYPES = "byTargetList" | "all";
export type listSorting_TYPES = "date" | "vocab-count" | "saved-count";

export interface FETCH_lists_ARGS {
  search: string;
  user_id: string;
  list_id: string;
  list_TYPE: privateOrPublic_TYPE;
  fetch_TYPE: listFetch_TYPES;
  amount: number;
  excludeIds: Set<string>;
  signal: AbortSignal;
  sorting: {
    type: listSorting_TYPES;
    direction: sortDirection_TYPE;
  };
  filters: ListFilter_PROPS;
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
