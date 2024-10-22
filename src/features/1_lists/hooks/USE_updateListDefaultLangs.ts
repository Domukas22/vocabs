import { useState, useCallback, useMemo } from "react";
import db, { Lists_DB } from "@/src/db";
import { List_MODEL } from "@/src/db/watermelon_MODELS";

export interface RenameList_PROPS {
  user_id: string | undefined;
  list_id: string | undefined;
  newLang_IDS: string[] | undefined;
  onSuccess?: (updated_LIST: List_MODEL) => void;
  cleanup?: () => void;
}

export default function USE_updateListDefaultLangs() {
  const [IS_updatingDefaultLangs, SET_renamingList] = useState(false);
  const [updateDefaultLangs_ERROR, SET_renameListError] = useState<
    string | null
  >(null);

  const RESET_error = useCallback(() => SET_renameListError(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to update the default list languages. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const UPDATE_defaultLangs = async ({
    newLang_IDS,
    user_id,
    list_id,
    onSuccess,
    cleanup,
  }: RenameList_PROPS): Promise<{
    success: boolean;
    updated_LIST?: List_MODEL | undefined;
    msg?: string;
  }> => {
    SET_renameListError(null); // Clear previous error

    // Validation checks
    if (!list_id) {
      SET_renameListError(errorMessage);
      return {
        success: false,
        msg: "🔴 List ID not provided for updating default list translations 🔴",
      };
    }

    if (!newLang_IDS) {
      SET_renameListError(errorMessage);
      return {
        success: false,
        msg: "🔴 Lang array not provided when tyring to edit default list translations 🔴",
      };
    }

    if (!user_id) {
      SET_renameListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for updating default list translations 🔴",
      };
    }

    SET_renamingList(true);
    try {
      console.log(newLang_IDS);

      const updated_LIST = await db.write(async () => {
        const list = await Lists_DB.find(list_id);
        await list.update((list: List_MODEL) => {
          list.default_lang_ids = newLang_IDS;
        });
      });

      if (onSuccess && updated_LIST) onSuccess(updated_LIST);
      if (cleanup) cleanup();

      return { success: true, updated_LIST };
    } catch (error: any) {
      // Handle network or connection errors differently
      if (error.message === "Failed to fetch") {
        SET_renameListError(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_renameListError(errorMessage);
      }

      return {
        success: false,
        msg: `🔴 Unexpected error occurred during renaming of the list: ${error.message} 🔴`,
      };
    } finally {
      SET_renamingList(false);
    }
  };

  return {
    UPDATE_defaultLangs,
    IS_updatingDefaultLangs,
    updateDefaultLangs_ERROR,
    RESET_error,
  };
}
