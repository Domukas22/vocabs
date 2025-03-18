//
//
//

import { PostgrestFilterBuilder } from "@supabase/postgrest-js";
import { TinyList_TYPE } from "@/src/features_new/lists/types";

export interface FETCH_myTinyLists_ARGS {
  search: string;
  user_id: string;
  amount: number;
  excludeIds: Set<string>;
  signal: AbortSignal;
}

export type FETCH_myTinyLists_RESPONSE_TYPE = {
  tiny_LISTS: TinyList_TYPE[];
  unpaginated_COUNT: number;
};

export type MyTinyListQuery_TYPE = PostgrestFilterBuilder<
  any,
  any,
  {
    id: any;
    name: any;
  }[],
  "lists",
  unknown
>;
