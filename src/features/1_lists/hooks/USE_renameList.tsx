//
//
//
import { useState, useCallback } from "react";
import RENAME_list, { renameList_ERRS } from "../utils/RENAME_list/RENAME_list";
import { UseFormSetError } from "react-hook-form";
import { Keyboard } from "react-native";
import { CREATE_manualFormErrorFromDbResponse } from "@/src/utils/CREATE_manualFormErrorFromDbResponse";
import HANDLE_internalError from "@/src/utils/SEND_internalError";
import GET_errroInfo from "@/src/utils/GET_errroInfo";
import HANDLE_userError from "@/src/utils/HANDLE_userError/HANDLE_userError";
import { Error_PROPS } from "@/src/props";
import {
  RenameList_ARGS,
  RenameList_RESPONSE,
  RenameListError_PROPS,
} from "../utils/RENAME_list/types";

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
  const [error, SET_error] = useState<Error_PROPS | undefined>(undefined);

  const RESET_backendErrors = useCallback(() => {
    SET_error(undefined);
  }, []);

  const memoizedOnSuccess = useCallback(() => {
    onSuccess();
  }, [onSuccess]);

  const memoizedOnError = useCallback(
    (e?: RenameListError_PROPS) => {
      SET_error(e);
      if (error?.error_TYPE !== "form_input") {
        Keyboard.dismiss();
      } else {
        CREATE_manualFormErrorFromDbResponse({
          formInput_ERRORS: e?.falsyForm_INPUTS,
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
        const { data, error: e } = await RENAME_list({
          list,
          user,
          new_NAME,
        });

        if (success) {
          memoizedOnSuccess();
        } else if (e) {
          memoizedOnError(e);
        }
      } catch (e: any) {
        const _error = HANDLE_userError({
          error: e,
          internalErrorUser_MSG: renameList_ERRS.user.defaultInternal_MSG,
        });

        memoizedOnError(_error); // Handle the error appropriately

        // track internal error
        if (_error?.error_TYPE === "internal") {
          await HANDLE_internalError({
            error: _error,
            function_NAME: "USE_renameList --> execute --> RENAME_list",
          });
        }
      } finally {
        SET_loading(false); // Ensure loading state is reset in both success and failure cases
      }
    },
    [loading, memoizedOnSuccess, memoizedOnError] // Add loading to the dependency array
  );

  return { loading, error, execute, RESET_backendErrors };
}
