//
//
//

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { list_TYPES, List_TYPE } from "../../../types";

export interface FETCH_lists_ARGS {
  search: string;
  user_id: string;
  list_TYPE: list_TYPES;

  langFilters: string[];
  sortDirection: "ascending" | "descending";

  amount: number;
  excludeIds: Set<string>;
  signal: AbortSignal;
}

export type FETCH_lists_RESPONSE_TYPE = {
  lists: List_TYPE[];
  unpaginated_COUNT: number;
};

export type ListQuery_TYPE = PostgrestFilterBuilder<
  any,
  any,
  any[],
  "lists",
  unknown
>;
