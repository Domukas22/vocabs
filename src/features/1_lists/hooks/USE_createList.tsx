import { useState, useCallback, useMemo } from "react";
import { supabase } from "@/src/lib/supabase";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import { List_PROPS } from "@/src/db/props";
import db, { Lists_DB } from "@/src/db";
import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { USER_ID } from "@/src/constants/globalVars";

export interface CreateList_PROPS {
  name: string;
  user_id: string | undefined;
  currentList_NAMES: string[];
  onSuccess?: (newList: List_PROPS) => void;
  cleanup?: () => void;
}

export default function USE_createList() {
  const [IS_creatingList, SET_creatingList] = useState(false);
  const [createList_ERROR, SET_createListError] = useState<string | null>(null);

  const RESET_error = useCallback(() => SET_createListError(null), []);

  const errorMessage = useMemo(
    () =>
      "Some kind of error happened when trying to create the list. This is an issue on our side. Please try to re-load the app and see if the problem persists. The issue has been recorded and will be reviewed by developers as soon as possible. We are sorry for the trouble.",
    []
  );

  const CREATE_list = async ({
    name,
    user_id,
    currentList_NAMES,
    onSuccess,
    cleanup,
  }: CreateList_PROPS): Promise<{
    success: boolean;
    newList?: List_PROPS | undefined;
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
      await db.write(async () => {
        const newList = await Lists_DB.create((newList: List_MODEL) => {
          newList.name = name;
          newList.user_id = user_id;
          newList.default_LANGS = ["en", "de"];
        });

        console.log("🟢 List created 🟢");

        if (onSuccess) onSuccess(newList);
        if (cleanup) cleanup();

        return { success: true, newList };
      });
    } catch (error: any) {
      // Handle specific errors
      console.log("🔴 Error creating list 🔴", error.message);
      SET_createListError(errorMessage);

      return {
        success: false,
        msg: `🔴 Unexpected error occurred during creation of the list: ${error.message} 🔴`,
      };
    } finally {
      SET_creatingList(false);
    }
  };

  return { CREATE_list, IS_creatingList, createList_ERROR, RESET_error };
}
