import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import db, { Lists_DB } from "@/src/db";

export interface ShareList_PROPS {
  list_id: string;
  user_id: string;
  SHOULD_share: boolean;
  onSuccess: () => Promise<void>;
}

export default function USE_shareList() {
  const [IS_sharingList, SET_sharingList] = useState(false);
  const [shareList_ERROR, SET_shareListError] = useState<string | null>(null);

  const RESET_shareListerror = useCallback(() => SET_shareListError(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to share the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const SHARE_list = async ({
    list_id,
    user_id,
    SHOULD_share,
    onSuccess,
  }: ShareList_PROPS): Promise<{
    success: boolean;
    updatedList?: List_MODEL | undefined;
    msg?: string;
  }> => {
    SET_shareListError(null); // Clear previous error

    // Validation checks
    if (!user_id) {
      SET_shareListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for list share 🔴",
      };
    }

    if (!list_id) {
      SET_shareListError("List ID is required for sharing a list.");
      return {
        success: false,
        msg: "🔴 List ID missing 🔴",
      };
    }

    SET_sharingList(true);
    try {
      const { data: updated_LIST, error } = await supabase
        .from("lists")
        .update({ type: SHOULD_share ? "shared" : "private" })
        .eq("id", list_id)
        .eq("user_id", user_id)
        .select("*")
        .single();

      if (error) {
        SET_shareListError(errorMessage);
        return {
          success: false,
          msg: "🔴 Error sharing list 🔴: " + error.message,
        };
      }

      if (onSuccess) {
        (async () => await onSuccess())();
      }

      return { success: true, updated_LIST };
    } catch (error: any) {
      // Handle network or connection errors differently
      if (error.message === "Failed to fetch") {
        SET_shareListError(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_shareListError(errorMessage);
      }

      return {
        success: false,
        msg: `🔴 Unexpected error occurred during the sharing of the list: ${error.message} 🔴`,
      };
    } finally {
      SET_sharingList(false);
    }
  };

  return { SHARE_list, IS_sharingList, shareList_ERROR, RESET_shareListerror };
}
