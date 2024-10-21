import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import db, { Lists_DB } from "@/src/db";

export interface PublishList_PROPS {
  list_id: string;
  user_id: string;
  isSubmittedForPublish: boolean; // Changed parameter name to reflect the purpose
  onSuccess: (updatedList: List_MODEL) => void;
}

export default function USE_publishList() {
  const [IS_publishingList, SET_publishingList] = useState(false);
  const [publishList_ERROR, SET_publishListError] = useState<string | null>(
    null
  );

  const RESET_publishListError = useCallback(
    () => SET_publishListError(null),
    []
  );

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to publish the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const PUBLISH_list = async ({
    list_id,
    user_id,
    isSubmittedForPublish,
    onSuccess,
  }: PublishList_PROPS): Promise<{
    success: boolean;
    updatedList?: List_MODEL | undefined;
    msg?: string;
  }> => {
    SET_publishListError(null); // Clear previous error

    // Validation checks
    if (!user_id) {
      SET_publishListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for list publish 🔴",
      };
    }

    if (!list_id) {
      SET_publishListError("List ID is required for publishing a list.");
      return {
        success: false,
        msg: "🔴 List ID missing 🔴",
      };
    }

    SET_publishingList(true);
    try {
      const updated_LIST = await db.write(async () => {
        const list = await Lists_DB.find(list_id);
        return await list.update((list: List_MODEL) => {
          list.is_submitted_for_publish = isSubmittedForPublish; // Update the publish status
        });
      });

      if (onSuccess && updated_LIST) onSuccess(updated_LIST);

      return { success: true, updatedList: updated_LIST };
    } catch (error: any) {
      // Handle network or connection errors differently
      if (error.message === "Failed to fetch") {
        SET_publishListError(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_publishListError(errorMessage);
      }

      return {
        success: false,
        msg: `🔴 Unexpected error occurred during the publishing of the list: ${error.message} 🔴`,
      };
    } finally {
      SET_publishingList(false);
    }
  };

  return {
    PUBLISH_list,
    IS_publishingList,
    publishList_ERROR,
    RESET_publishListError,
  };
}
