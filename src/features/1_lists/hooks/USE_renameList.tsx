//
//
//
import { useState, useCallback } from "react";
import RENAME_list, {
  RenameList_ARGS,
  RenameList_ERROR,
} from "../utils/RENAME_list/RENAME_list";
import { UseFormSetError } from "react-hook-form";
import { Keyboard } from "react-native";
import { CREATE_manualFormErrorFromDbResponse } from "@/src/utils/CREATE_manualFormErrorFromDbResponse";
import SEND_internalError from "@/src/utils/SEND_internalError";
import GET_errroInfo from "@/src/utils/GET_errroInfo";

type UseRenameList_PROPS = {
  SET_formError: UseFormSetError<{
    name: string;
  }>;
  onSuccess: () => void;
};

// Custom Hook for renaming list
export function USE_renameList({
  SET_formError,
  onSuccess = () => {},
}: UseRenameList_PROPS) {
  const [loading, SET_loading] = useState(false);
  const [error, SET_error] = useState<RenameList_ERROR | undefined>(undefined);

  const RESET_backendErrors = useCallback(() => {
    SET_error(undefined);
  }, []);

  const memoizedOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const memoizedOnError = useCallback(
    (error?: RenameList_ERROR) => {
      SET_error(error);
      if (error?.type !== "form_input") {
        Keyboard.dismiss();
      } else {
        CREATE_manualFormErrorFromDbResponse({
          formInput_ERRORS: error?.formInput_ERRORS,
          SET_formError,
        });
      }
    },
    [SET_formError]
  );

  const execute = useCallback(
    async ({ list, user, new_NAME }: RenameList_ARGS) => {
      if (loading) return; // Prevent multiple concurrent requests

      SET_loading(true); // Set loading state before API call
      SET_error(undefined); // Reset errors before making the request

      try {
        const { success, error } = await RENAME_list({
          list,
          user,
          new_NAME,
        });

        if (success) {
          memoizedOnSuccess();
        } else if (error) {
          memoizedOnError(error);
        }
      } catch (err: any) {
        // Catch unexpected errors and handle them
        const { error_TYPE, userError_MESSAGE } = GET_errroInfo({
          error,
          process: "trying to rename the list",
        });

        // track internal error
        if (error_TYPE === "internal") {
          await SEND_internalError({
            message: err.message,
            function_NAME: "USE_renameList --> execute --> RENAME_list",
            details: err,
          });
        }

        const user_ERROR: RenameList_ERROR = {
          message: userError_MESSAGE,
          type: error_TYPE,
          formInput_ERRORS: error?.formInput_ERRORS,
        };

        memoizedOnError(user_ERROR); // Handle the error appropriately
      } finally {
        SET_loading(false); // Ensure loading state is reset in both success and failure cases
      }
    },
    [loading, memoizedOnSuccess, memoizedOnError] // Add loading to the dependency array
  );

  return { loading, error, execute, RESET_backendErrors };
}
