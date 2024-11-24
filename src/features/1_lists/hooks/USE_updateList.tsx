//
//
//
import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import List_MODEL from "@/src/db/models/List_MODEL";

export interface UpdateList_PROPS {
  name: string;
  list_id: string;
  user_id: string;
  currentList_NAMES: string[];
  onSuccess: (updatedList: List_MODEL) => void;
}

export default function USE_updateList() {
  const [IS_updatingList, SET_updatingList] = useState(false);
  const [updateList_ERROR, SET_updateListError] = useState<string | null>(null);

  const RESET_error = useCallback(() => SET_updateListError(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to update the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const UPDATE_list = async ({
    name,
    list_id,
    user_id,
    currentList_NAMES,
    onSuccess,
  }: UpdateList_PROPS): Promise<{
    success: boolean;
    updatedList?: List_MODEL | undefined;
    msg?: string;
  }> => {
    SET_updateListError(null); // Clear previous error

    // Validation checks
    if (!name) {
      SET_updateListError("You must provide a list name.");
      return {
        success: false,
        msg: "🔴 List name not provided for list update 🔴",
      };
    }

    if (currentList_NAMES?.some((listName) => listName === name)) {
      SET_updateListError("You already have a list with that name");
      return {
        success: false,
        msg: "🔴 List name already exists 🔴",
      };
    }

    if (!user_id) {
      SET_updateListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for list update 🔴",
      };
    }

    if (!list_id) {
      SET_updateListError("List ID is required for updating a list.");
      return {
        success: false,
        msg: "🔴 List ID missing 🔴",
      };
    }

    SET_updatingList(true);
    try {
      const { data: updatedList, error } = await supabase
        .from("lists")
        .update({ name })
        .eq("id", list_id)
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) {
        SET_updateListError(errorMessage);
        return {
          success: false,
          msg: "🔴 Error updating the list. Please try again later. 🔴",
        };
      }

      if (onSuccess && updatedList) onSuccess(updatedList);

      return { success: true, updatedList };
    } catch (error: any) {
      // Handle network or connection errors differently
      if (error.message === "Failed to fetch") {
        SET_updateListError(
          "It looks like there's an issue with your internet connection. Please check your connection and try again."
        );
      } else {
        SET_updateListError(errorMessage);
      }

      return {
        success: false,
        msg: `🔴 Unexpected error occurred during the update of the list: ${error.message} 🔴`,
      };
    } finally {
      SET_updatingList(false);
    }
  };

  return { UPDATE_list, IS_updatingList, updateList_ERROR, RESET_error };
}
