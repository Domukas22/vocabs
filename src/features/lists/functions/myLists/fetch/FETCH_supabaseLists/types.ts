//
//
//

import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import { Error_PROPS } from "@/src/props";
import { z_listDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";

export const ExtendSupabaseListQuery_ERRS = {
  internal: {
    query_undefined: "Received query was undefined",
    not_public_and_not_shared:
      "Received list type was neither 'shared' nor 'public'",
    shared_but_listIds_undefined:
      "List type was 'shared', but list_ids undefined",
    query_doesnt_have_method_eq: "Received query didin't have 'eq' method",
    query_doesnt_have_method_in: "Received query didin't have 'in' method",
    query_doesnt_have_method_or: "Received query didin't have 'or' method",
    query_doesnt_have_method_order:
      "Received query didin't have 'order' method",
    query_doesnt_have_method_abortSignal:
      "Received query didin't have 'abortSignal' method",
    query_doesnt_have_method_range:
      "Received query didin't have 'range' method",
    search_value_isnt_string: "Received search value wasn't a string",
    lang_filters_isnt_array:
      "Received language filters weren't inside an array",
    lang_filters_arent_strings: "Received language filters weren't strings",
    invalid_sorting: "Sorting was not 'date'",
    invalid_sort_direction:
      "Sort direction was neither 'ascending' not 'descending'",
    undefined_query_start: "Query pagiantion 'start' was undefined",
    undefined_query_end: "Query pagiantion 'end' was undefined",
    query_end_is_smaller_than_start:
      "Query pagiantion 'end' was smaller than 'start'",
    z_display_settings_undefined: "'z_listDisplay_SETTINGS' was undefined",
    failed_supabase_fetch: "Failed to fetch supabase lists",
  },
  user: {
    defaultInternal_MSG: CREATE_internalErrorMsg("trying to load lists"),
    networkFailure: "There seems to an issue with your internet connection.",
  },
};

export interface FetchSupabaseLists_ARGS {
  type: "public" | "shared";
  list_ids: string[] | null | undefined;
  search?: string;
  z_listDisplay_SETTINGS?: z_listDisplaySettings_PROPS;
  start: number;
  end: number;
  signal: AbortSignal | undefined;
}

export type FetchSupabaseListsError_PROPS = Error_PROPS;
export type FetchSupabaseLists_DATA = {
  lists:
    | {
        id: any;
        name: any;
        description: any;
        collected_lang_ids: any;
        username: any;
        vocabs: {
          count: any;
        }[];
      }[]
    | null;
  count: number;
};

export type FetchSupabaseLists_RESPONSE = {
  data?: FetchSupabaseLists_DATA;
  error?: FetchSupabaseListsError_PROPS;
};
