//
//
//
import { List_PROPS, User_PROPS } from "@/src/db/props";
import { supabase } from "@/src/lib/supabase";
import { useCallback, useMemo, useState } from "react";

interface ListDelete_PROPS {
  user_id: string | undefined;
  list_id: string | undefined;
  onSuccess?: (deletedList: List_PROPS) => void;
  cleanup?: () => void;
}

export default function USE_deleteList() {
  const [IS_deletingList, SET_isDeletingList] = useState(false);
  const [error, SET_error] = useState<string | null>(null);
  const RESET_error = useCallback(() => SET_error(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to delete the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const DELETE_list = async ({
    user_id,
    list_id,
    onSuccess,
    cleanup,
  }: ListDelete_PROPS) => {
    SET_error(null); // Clear previous error

    // Validation checks
    if (!list_id) {
      SET_error(errorMessage);
      return { success: false, msg: "🔴 List ID not provided for deletion 🔴" };
    }

    if (!user_id) {
      SET_error(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID missing for list deletion 🔴",
      };
    }

    SET_isDeletingList(true);
    try {
      // Validate that the list exists for the given user
      const { data: listData, error: listError } = await supabase
        .from("lists")
        .select()
        .eq("id", list_id)
        .eq("user_id", user_id)
        .single();

      if (listError) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Error fetching list with ID ${list_id} for user ${user_id} 🔴: ${listError.message}`,
        };
      }

      if (!listData) {
        SET_error(
          "It seems this list has already been deleted or could not be found."
        );
        return {
          success: false,
          msg: `🔴 List with ID ${list_id} not found for user ${user_id} 🔴`,
        };
      }

      // Delete associated data if applicable (optional - add logic for related data if needed)

      // Delete the list
      const { data: deletedListData, error: deleteError } = await supabase
        .from("lists")
        .delete()
        .eq("id", list_id)
        .select()
        .single();

      if (deleteError) {
        SET_error(errorMessage);
        return {
          success: false,
          msg: `🔴 Error deleting list with ID ${list_id} 🔴: ${deleteError.message}`,
        };
      }

      // Log success message
      console.log("🟢 List deleted successfully 🟢");

      // Post-delete callback
      if (onSuccess) onSuccess(deletedListData);
      if (cleanup) cleanup();

      return { success: true, data: deletedListData };
    } catch (error: any) {
      // Handle network or connection errors differently
      if (error.message === "Failed to fetch") {
        SET_error(
          "There seems to be an issue with your internet connection. Please check and try again."
        );
      } else {
        SET_error(errorMessage);
      }
      return {
        success: false,
        msg: `🔴 Unexpected error occurred during deletion of list ID ${list_id} 🔴: ${error.message}`,
      };
    } finally {
      SET_isDeletingList(false);
    }
  };

  return { DELETE_list, IS_deletingList, error, RESET_error };
}
