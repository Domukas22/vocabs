//
//
//

import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import { supabase } from "@/src/lib/supabase";
import { SupabaseListAccessesError_PROPS } from "../props";
import {
  ListIdsSharedWithMe_DATA,
  ListIdsSharedWithMe_RESPONSE,
} from "./props";
import CHECK_ifNetworkFailure from "@/src/utils/CHECK_ifNetworkFailure/CHECK_ifNetworkFailure";
import { PostgrestError } from "@supabase/supabase-js";
import HANDLE_userErrorInsideFinalCatchBlock from "@/src/utils/HANDLE_userErrorInsideFinalCatchBlock/HANDLE_userErrorInsideFinalCatchBlock";

export const errs = {
  internal: {
    noUserId:
      "user_id undefined when fetching list accesses where I am participant in",
    invalidDataReturned:
      "Fetched unexpected values from supabase that are NOT list_id",
    failedSupabaseFetch:
      "Failed to fetch list accesses where I am participant in",
  },
  user: {
    defaultInternal_MSG: CREATE_internalErrorMsg("trying to load shared lists"),
    networkFailure: "There seems to an issue with your internet connection.",
  },
};

const GENERATE_error = (
  data: Omit<SupabaseListAccessesError_PROPS, "function_NAME">
) => ({ ...data, function_NAME: "FETCH_listIdsSharedWithMe" });

export async function FETCH_listIdsSharedWithMe(
  user_id: string
): Promise<ListIdsSharedWithMe_RESPONSE> {
  try {
    VALIDATE_args(user_id);

    const { data, error } = await supabase
      .from("list_accesses")
      .select("list_id")
      .eq("participant_id", user_id);

    VALIDATE_supabaseFetch(error);
    VALIDATE_supabaseData(data);

    return { data: data || [] };
    // -------------------------------------------------
  } catch (error: any) {
    return {
      data: [],
      error: HANDLE_userErrorInsideFinalCatchBlock({
        function_NAME: "FETCH_listIdsSharedWithMe",
        error,
        internalErrorUser_MSG: errs.user.defaultInternal_MSG,
      }),
    };
  }
}

function VALIDATE_supabaseData(data: ListIdsSharedWithMe_DATA) {
  if (data && data?.length > 0) {
    // does the first item have and id and username
    if (!data[0]?.list_id)
      throw GENERATE_error({
        error_TYPE: "internal",
        user_MSG: errs.user.defaultInternal_MSG,
        internal_MSG: errs.internal.invalidDataReturned,
      });
  }
}
function VALIDATE_args(user_id: string | undefined) {
  if (!user_id) {
    throw GENERATE_error({
      error_TYPE: "internal",
      user_MSG: errs.user.defaultInternal_MSG,
      internal_MSG: errs.internal.noUserId,
    });
  }
}
function VALIDATE_supabaseFetch(error: PostgrestError | null) {
  if (error) {
    const IS_networkFailure = CHECK_ifNetworkFailure(error);

    if (IS_networkFailure) {
      throw GENERATE_error({
        error_TYPE: "user_network",
        user_MSG: errs.user.networkFailure,
      });
    } else {
      throw GENERATE_error({
        error_TYPE: "internal",
        user_MSG: errs.user.defaultInternal_MSG,
        internal_MSG: errs.internal.failedSupabaseFetch,
        error_DETAILS: error,
      });
    }
  }
}
