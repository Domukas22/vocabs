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
import EXTEND_supabaseListquery from "./utils/EXTEND_supabaseListquery";

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
    if (type !== "shared" && type !== "public")
      throw GENERATE_internalError("not_public_and_not_shared");

    if (type === "shared" && !list_ids)
      throw GENERATE_internalError("shared_but_listIds_undefined");

    const initial_QUERY = supabase.from("lists").select(
      `
          id,
          name,
          description,
          collected_lang_ids,
          ...users!lists_2_user_id_fkey(username),
          vocabs(count)
        `,
      { count: "exact" }
    );

    const query = EXTEND_supabaseListquery({
      query: initial_QUERY,
      list_ids,
      type,
      search,
      z_listDisplay_SETTINGS,
      start,
      end,
    });

    // const { data, error, count } = await query.abortSignal(signal);
    const { data, error, count } = await query;

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
  type:
    | "not_public_and_not_shared"
    | "shared_but_listIds_undefined"
    | "failed_supabase_fetch",
  details: any = undefined
) {
  let internal_MSG = "";
  let error_DETAILS = details;

  switch (type) {
    case "not_public_and_not_shared":
      internal_MSG = fetchSupabaseLists_ERRS.internal.inproperListType;
      break;
    case "shared_but_listIds_undefined":
      internal_MSG = fetchSupabaseLists_ERRS.internal.listIdsUndefined;
      break;
    case "failed_supabase_fetch":
      internal_MSG = fetchSupabaseLists_ERRS.internal.failedSupabaseFetch;
      break;
    default:
      internal_MSG = "Something went wrong when fethcing supabase lists";
  }

  // });
  return {
    error_TYPE: "internal",
    user_MSG: fetchSupabaseLists_ERRS.user.defaultInternal_MSG,
    internal_MSG,
    function_NAME: "FETCH_supabaseLists",
    error_DETAILS,
  } as FetchSupabaseListsError_PROPS;
}
