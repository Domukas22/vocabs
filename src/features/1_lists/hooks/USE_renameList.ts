import { useState } from "react";
import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import USE_error from "@/src/hooks/USE_error";

export interface RenameList_PROPS {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  new_NAME: string | undefined;
}

const defaultError_MSG =
  "An error occurred when renaming the list. Please reload the app and try again. If the problem persists, it has been recorded and will be reviewed. We apologize for the inconvenience.";

export default function USE_renameList() {
  const { HAS_error, userError_MSG, CREATE_error, RESET_error } = USE_error();
  const [loading, SET_loading] = useState(false);

  const HANDLE_validationErrors = (message: string, internalMsg?: string) => {
    CREATE_error({ userError_MSG: message, internalError_MSG: internalMsg });
    return { success: false, userError_MSG: message };
  };

  const RENAME_list = async ({
    new_NAME,
    list,
    user,
  }: RenameList_PROPS): Promise<{
    success: boolean;
    updated_LIST?: List_MODEL;
    userError_MSG?: string;
  }> => {
    RESET_error();
    SET_loading(true);

    // Validation checks
    if (!list?.id)
      return HANDLE_validationErrors(
        defaultError_MSG,
        "🔴 List object undefined when renaming list 🔴"
      );
    if (!user?.id)
      return HANDLE_validationErrors(
        defaultError_MSG,
        "🔴 User object undefined when renaming list 🔴"
      );
    if (!new_NAME)
      return HANDLE_validationErrors("Please provide a new name for the list.");

    try {
      // Check for duplicate list name
      const IS_listNameTaken = await user.DOES_userHaveListWithThisName(
        new_NAME
      );
      if (IS_listNameTaken) {
        return HANDLE_validationErrors(
          "You already have a list with this name."
        );
      }

      // Proceed with renaming
      const updated_LIST = await list.rename(new_NAME);
      if (!updated_LIST) {
        return HANDLE_validationErrors(
          defaultError_MSG,
          "🔴 Rename function returned an undefined list object. 🔴"
        );
      }

      return { success: true, updated_LIST };
    } catch (error: any) {
      // Handle network errors and unexpected errors
      const networkErrorMsg =
        "It looks like there's an issue with your internet connection. Please check and try again.";
      const errorMessage =
        error.message === "Failed to fetch"
          ? networkErrorMsg
          : defaultError_MSG;
      const internalMessage =
        error.message !== "Failed to fetch"
          ? `🔴 Unexpected renaming error: 🔴 ${error.message}`
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
    RENAME_list,
    loading,
    HAS_error,
    userError_MSG,
    RESET_error,
  };
}
