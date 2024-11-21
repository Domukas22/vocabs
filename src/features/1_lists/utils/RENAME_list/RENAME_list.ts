//
//
//

import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import { CREATE_error, Error_TYPES, FormInputError_PROPS } from "@/src/props";

import GET_errroInfo from "@/src/utils/GET_errroInfo";
import SEND_internalError from "@/src/utils/SEND_internalError";

type RenameListForm_INPUTS = "name";

const CREATE_renameListError = (
  message: string,
  type: Error_TYPES,
  formInput_ERRORS?: FormInputError_PROPS<RenameListForm_INPUTS>,
  details?: Object
) =>
  CREATE_error<RenameListForm_INPUTS>({
    message,
    type,
    formInput_ERRORS,
    details,
  });

export type RenameList_ARGS = {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  new_NAME: string | undefined;
};

export type RenameList_ERROR = {
  message?: string;
  type?: Error_TYPES;
  formInput_ERRORS?: FormInputError_PROPS<RenameListForm_INPUTS>;
};

export type RenameList_RESPONSE = {
  success: boolean;
  error?: RenameList_ERROR;
};

export default async function RENAME_list(
  args: RenameList_ARGS
): Promise<RenameList_RESPONSE> {
  const { new_NAME, list, user } = args;

  try {
    if (!new_NAME) {
      throw CREATE_renameListError(
        "Please correct the errors above",
        "form_input",
        [
          {
            input_NAME: "name",
            message: "Please provide a new name for the list",
          },
        ]
      );
    }

    if (new_NAME === list?.name) return { success: true };

    if (!user) {
      throw CREATE_renameListError(
        "User object undefined when renaming list",
        "internal"
      );
    }

    const IS_listNameTaken = await user.DOES_userHaveListWithThisName(new_NAME);
    if (IS_listNameTaken) {
      throw CREATE_renameListError(
        "Please correct the errors above",
        "form_input",
        [
          {
            input_NAME: "name",
            message: "You already have a list with this name",
          },
        ]
      );
    }

    if (!list) {
      throw CREATE_renameListError(
        "List object undefined when renaming list",
        "internal"
      );
    }

    const renamed_LIST = await list.rename(new_NAME);
    if (!renamed_LIST) {
      throw CREATE_renameListError(
        "renamed_LIST object returned undefined from WatermelonDB when renaming list",
        "internal"
      );
    }

    return { success: true };
    // -------------------------------------------------
  } catch (error: any) {
    const { error_TYPE, userError_MESSAGE } = GET_errroInfo({
      error,
      process: "trying to rename the list",
    });

    // track internal error
    if (error_TYPE === "internal") {
      await SEND_internalError({
        message: error.message,
        function_NAME: "RENAME_list",
        details: error,
      });
    }

    // handle error response for user
    return {
      success: false,
      error: {
        message: userError_MESSAGE,
        type: error_TYPE,
        formInput_ERRORS: error?.formInput_ERRORS,
      },
    };
  }
}
