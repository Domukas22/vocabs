//
//
//

import { supabase } from "@/src/lib/supabase";
import {
  ListParticipants_ARGS,
  ListParticipants_DATA,
  ListParticipants_RESPONSE,
  ListParticipantsError_PROPS,
} from "./props";
import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import { CHECK_ifNetworkFailure } from "@/src/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { HANDLE_userErrorInsideFinalCatchBlock } from "@/src/utils";

export const fetchListParticipants_ERRS = {
  internal: {
    noListId: "list_id undefined when fetching list participants",
    noOwnerId: "owner_id undefined when fetching list participants",
    invalidDataReturned:
      "Fetched unexpected values from supabase that are NOT id and username",
    failedSupabaseFetch:
      "Failed to fetch list accesses where I am participant in",
  },
  user: {
    defaultmessage: CREATE_internalErrorMsg("trying to load list participants"),
    networkFailure: "There seems to an issue with your internet connection.",
  },
};

const GENERATE_error = (
  data: Omit<ListParticipantsError_PROPS, "function_NAME">
) => ({ ...data, function_NAME: "FETCH_listParticipants" });

export async function FETCH_listParticipants({
  list_id,
  owner_id,
}: ListParticipants_ARGS): Promise<ListParticipants_RESPONSE> {
  try {
    VALIDATE_args(list_id, owner_id);

    const { data, error } = await supabase
      .from("list_accesses")
      .select("...participant_id(id, username)")

      .eq("list_id", list_id)
      .eq("owner_id", owner_id);

    VALIDATE_supabaseFetch(error);
    VALIDATE_supabaseData(data);

    return { data: data || [] };
  } catch (error: any) {
    return {
      data: [],
      error: HANDLE_userErrorInsideFinalCatchBlock({
        function_NAME: "FETCH_listParticipants",
        error,
        internalErrorUser_MSG: fetchListParticipants_ERRS.user.defaultmessage,
      }),
    };
  }
}

function VALIDATE_supabaseData(data: ListParticipants_DATA) {
  if (data && data?.length > 0) {
    // does the first item have and id and username
    if (!data[0]?.id || !data[0]?.username)
      throw GENERATE_error({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.invalidDataReturned,
      });
  }
}
function VALIDATE_args(
  list_id: string | undefined,
  owner_id: string | undefined
) {
  if (!list_id) {
    throw GENERATE_error({
      error_TYPE: "internal",
      user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
      message: fetchListParticipants_ERRS.internal.noListId,
    });
  }
  if (!owner_id) {
    throw GENERATE_error({
      error_TYPE: "internal",
      user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
      message: fetchListParticipants_ERRS.internal.noOwnerId,
    });
  }
}

function VALIDATE_supabaseFetch(error: PostgrestError | null) {
  if (error) {
    const IS_networkFailure = CHECK_ifNetworkFailure(error);

    if (IS_networkFailure) {
      throw GENERATE_error({
        error_TYPE: "user_network",
        user_MSG: fetchListParticipants_ERRS.user.networkFailure,
      });
    } else {
      throw GENERATE_error({
        error_TYPE: "internal",
        user_MSG: fetchListParticipants_ERRS.user.defaultmessage,
        message: fetchListParticipants_ERRS.internal.failedSupabaseFetch,
        error_DETAILS: error,
      });
    }
  }
}
