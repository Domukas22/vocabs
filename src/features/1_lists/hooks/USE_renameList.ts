import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import { List_MODEL } from "@/src/db/props";

export interface RenameList_PROPS {
  list_id: string | undefined;
  newName: string | undefined;
  user_id: string | undefined;
  currentList_NAMES: string[];
  onSuccess?: (updated_LIST: List_MODEL) => void;
  cleanup?: () => void;
}

export default function USE_renameList() {
  const [IS_renamingList, SET_renamingList] = useState(false);
  const [renameList_ERROR, SET_renameListError] = useState<string | null>(null);

  const RESET_error = useCallback(() => SET_renameListError(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to rename the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const RENAME_list = async ({
    newName,
    user_id,
    list_id,
    currentList_NAMES,
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
        msg: "🔴 List ID not provided for renaming 🔴",
      };
    }

    if (!newName) {
      SET_renameListError("You must provide a new list name.");
      return {
        success: false,
        msg: "🔴 New list name not provided 🔴",
      };
    }

    if (currentList_NAMES?.some((listName) => listName === newName)) {
      SET_renameListError("You already have a list with that name.");
      return {
        success: false,
        msg: "🔴 New list name already exists 🔴",
      };
    }

    if (!user_id) {
      SET_renameListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for renaming 🔴",
      };
    }

    SET_renamingList(true);
    try {
      const { data: updated_LIST, error } = await supabase
        .from("lists")
        .update({ name: newName })
        .eq("user_id", user_id)
        .eq("id", list_id)
        .select()
        .single();

      if (error) {
        SET_renameListError(errorMessage);
        return {
          success: false,
          msg: `🔴 Something went wrong when renaming list 🔴: ${error}`,
        };
      }

      console.log("🟢 List renamed 🟢");
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

  return { RENAME_list, IS_renamingList, renameList_ERROR, RESET_error };
}
