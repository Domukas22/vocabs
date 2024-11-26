//
//
//

import { supabase } from "@/src/lib/supabase";
import CHECK_ifNetworkFailure from "@/src/utils/CHECK_ifNetworkFailure";
import HANDLE_userError from "@/src/utils/HANDLE_userError/HANDLE_userError";

import {
  FetchSupabaseListsError_PROPS,
  FetchSupabaseLists_ARGS,
  ListParticipants_RESPONSE,
  fetchSupabaseLists_ERRS,
} from "./types";
import BUILD_supabaseListQuery from "../BUILD_supabaseListQuery/BUILD_supabaseListQuery";

export default async function FETCH_supabaseLists({
  search,
  list_ids,
  z_listDisplay_SETTINGS,
  start = 0,
  end = 10,
  signal,
  type,
}: FetchSupabaseLists_ARGS): Promise<ListParticipants_RESPONSE> {
  try {
    const { query, error: extendQuery_ERROR } = BUILD_supabaseListQuery({
      list_ids,
      type,
      search,
      z_listDisplay_SETTINGS,
      start,
      end,
    });
    if (extendQuery_ERROR) throw extendQuery_ERROR;

    const { data, error, count } = await query.abortSignal(signal);
    if (error) throw GENERATE_internalError("failed_supabase_fetch", error);

    return {
      data: {
        lists: data || [],
        count: count || 0,
      },
    };
  } catch (error: any) {
    return {
      data: {
        lists: [],
        count: 0,
      },
      error: HANDLE_userError({
        error,
        function_NAME: "FETCH_supabaseLists",
        internalErrorUser_MSG: fetchSupabaseLists_ERRS.user.defaultInternal_MSG,
      }),
    };
  }
}

function GENERATE_internalError(
  type: "failed_supabase_fetch" | "failed_to_extend_query",

  details: any = undefined
) {
  let internal_MSG = "";
  let error_DETAILS = details;

  switch (type) {
    case "failed_to_extend_query":
      internal_MSG = fetchSupabaseLists_ERRS.internal.failedtoExtendQuery;
      break;
    case "failed_supabase_fetch":
      internal_MSG = fetchSupabaseLists_ERRS.internal.failedSupabaseFetch;
      break;
  }

  return {
    error_TYPE: "internal",
    user_MSG: fetchSupabaseLists_ERRS.user.defaultInternal_MSG,
    internal_MSG,
    function_NAME: "FETCH_supabaseLists",
    error_DETAILS,
  } as FetchSupabaseListsError_PROPS;
}
