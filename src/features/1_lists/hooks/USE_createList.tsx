import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";

import db, { Lists_DB, Users_DB } from "@/src/db";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";

export interface CreateList_PROPS {
  name: string;
  description: string;
  user_id: string | undefined;
  currentList_NAMES: string[] | undefined;
  onSuccess?: (newList: List_MODEL) => void;
  cleanup?: () => void;
}

export default function USE_createList() {
  "CREATE";

  const [IS_creatingList, SET_creatingList] = useState(false);
  const [createList_ERROR, SET_createListError] = useState<string | null>(null);

  const RESET_createListError = useCallback(
    () => SET_createListError(null),
    []
  );

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to create the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const CREATE_list = async ({
    name,
    description,
    user_id,
    currentList_NAMES,
    onSuccess,
    cleanup,
  }: CreateList_PROPS): Promise<{
    success: boolean;
    new_LIST?: List_MODEL | undefined;
    msg?: string;
  }> => {
    SET_createListError(null); // Clear previous error

    // Validation checks
    if (!name) {
      SET_createListError("You must provide a list name.");
      return {
        success: false,
        msg: "🔴 List name not provided for list creation 🔴",
      };
    }

    if (currentList_NAMES?.some((listName) => listName === name)) {
      SET_createListError("You already have a list with that name");
      return {
        success: false,
        msg: "🔴 List name already exists 🔴",
      };
    }

    if (!user_id) {
      SET_createListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for list creation 🔴",
      };
    }

    SET_creatingList(true);
    try {
      const new_LIST = await db.write(async () => {
        const newList = await Lists_DB.create((newList: List_MODEL) => {
          newList.user_id = user_id;
          newList.original_creator_id = user_id;

          newList.name = name || "";
          newList.description = description || "";
          newList.default_lang_ids = ["en", "de"];
          newList.is_submitted_for_publish = false;
          newList.was_accepted_for_publish = false;
          newList.type = "private";
        });
        return newList;
      });
      if (onSuccess) onSuccess(new_LIST);
      if (cleanup) cleanup();

      return { success: true, new_LIST };
    } catch (error: any) {
      // Handle specific errors
      console.error("🔴 Error creating list 🔴", error.message);
      SET_createListError(errorMessage);

      return {
        success: false,
        msg: `🔴 Unexpected error occurred during creation of the list: ${error.message} 🔴`,
      };
    } finally {
      SET_creatingList(false);
    }
  };

  return {
    CREATE_list,
    IS_creatingList,
    createList_ERROR,
    RESET_createListError,
  };
}
