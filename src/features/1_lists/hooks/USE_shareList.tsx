import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import db, { Lists_DB } from "@/src/db";
import USE_error from "@/src/hooks/USE_error";
import { USE_sync } from "@/src/db/USE_sync";

export interface ShareList_PROPS {
  list_id: string | undefined;
  user_id: string | undefined;
  SHOULD_share: boolean;
}

const defaultError_MSG =
  "Something went wrong when trying to share the list. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

export default function USE_shareList() {
  const {
    HAS_error,
    userError_MSG,
    HAS_internalError,
    CREATE_error,
    RESET_error,
  } = USE_error();
  const [loading, SET_loading] = useState(false);

  const HANDLE_validationErrors = (message: string, internalMsg?: string) => {
    CREATE_error({ userError_MSG: message, internalError_MSG: internalMsg });
    return { success: false, userError_MSG: message };
  };

  const { sync, HAS_syncError } = USE_sync();

  const SHARE_list = async ({
    list_id,
    user_id,
    SHOULD_share,
  }: ShareList_PROPS): Promise<{
    success: boolean;
    updated_LIST?: List_MODEL | undefined;
    userError_MSG?: string;
  }> => {
    RESET_error();

    if (!user_id)
      return HANDLE_validationErrors(
        defaultError_MSG,
        "🔴 User id undefined when sharing list list 🔴"
      );
    if (!list_id)
      return HANDLE_validationErrors(
        defaultError_MSG,
        "🔴 List id undefined when sharing list list 🔴"
      );

    try {
      SET_loading(true);
      await sync();

      if (HAS_syncError)
        return HANDLE_validationErrors(
          defaultError_MSG,
          "🔴 Something went wrong with  🔴"
        );
      const { data: updated_LIST, error } = await supabase
        .from("lists")
        .update({ type: SHOULD_share ? "shared" : "private" })
        .eq("id", list_id)
        .eq("user_id", user_id)
        .select("*")
        .single();

      if (error)
        return HANDLE_validationErrors(
          defaultError_MSG,
          `🔴 Something went wrong when sharing list 🔴: ${error?.message}`
        );

      return { success: true, updated_LIST };
    } catch (error: any) {
      // Handle network or connection errors differently
      const networkErrorMsg = // this isnt really necessary when we are working with local functions. Use this only with online functions
        "It looks like there's an issue with your internet connection. Please check and try again.";
      const errorMessage =
        error?.message === "Failed to fetch"
          ? networkErrorMsg
          : defaultError_MSG;
      const internalMessage =
        error?.message !== "Failed to fetch"
          ? `🔴 Unexpected sharing list: 🔴 ${error?.message}`
          : undefined;

      CREATE_error({
        userError_MSG: errorMessage,
        internalError_MSG: internalMessage,
      });
      return { success: false, userError_MSG: errorMessage };
    } finally {
      SET_loading(false);
    }
  };

  return {
    SHARE_list,
    IS_sharingList: loading,
    HAS_error,
    userError_MSG,
    HAS_internalError,
  };
}
