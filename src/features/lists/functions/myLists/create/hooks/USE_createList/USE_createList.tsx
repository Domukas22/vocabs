import { useState, useCallback, useMemo } from "react";

import db, { Lists_DB, Users_DB } from "@/src/db";
import List_MODEL from "@/src/db/models/List_MODEL";

export interface CreateList_PROPS {
  name: string;
  description: string;
  user_id: string | undefined;
  onSuccess?: (newList: List_MODEL) => void;
  cleanup?: () => void;
}

export function USE_createList() {
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

    if (!user_id) {
      SET_createListError(errorMessage);
      return {
        success: false,
        msg: "🔴 User ID not provided for list creation 🔴",
      };
    }

    SET_creatingList(true);
    try {
      const user = await Users_DB.find(user_id);

      if (!user) {
        SET_createListError(errorMessage);
        return {
          success: false,
          msg: "🔴 User not found in WatermelonDb when creating a list 🔴",
        };
      }
      const new_LIST = await db.write(async () => {
        const newList = await Lists_DB.create((newList: List_MODEL) => {
          newList.user_id = user.id;
          newList.original_creator_id = user.id;

          newList.name = name || "";
          newList.type = "private";
          newList.default_lang_ids = "en,de";
          newList.description = description || "";
          newList.is_submitted_for_publish = false;
          newList.was_accepted_for_publish = false;
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
