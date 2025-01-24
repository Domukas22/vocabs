//
//
//

import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import { HANDLE_userErrorInsideFinalCatchBlock } from "@/src/utils";
import {
  FalsyFormInputArray_PROPS,
  RenameList_ARGS,
  RenameList_RESPONSE,
  RenameListError_PROPS,
} from "./types";

import List_MODEL from "@/src/db/models/List_MODEL";
import User_MODEL from "@/src/db/models/User_MODEL";

export const renameList_ERRS = {
  internal: {
    userUndefined: "User object undefined when renaming list",
    listUndefined: "List object undefined when renaming list",
    watermelonRename:
      "renamed_LIST object returned undefined from WatermelonDB when renaming list",
  },
  user: {
    defaultInternal_MSG: CREATE_internalErrorMsg("trying to rename the list"),
    falsyInput: "Please correct the errors above",
    noNameProvided_OBJ: [
      {
        input_NAME: "name",
        message: "Please provide a new name for the list",
      },
    ] as FalsyFormInputArray_PROPS,
    listNameTaken_OBJ: [
      {
        input_NAME: "name",
        message: "You already have a list with this name",
      },
    ] as FalsyFormInputArray_PROPS,
  },
};

export async function RENAME_list(
  args: RenameList_ARGS
): Promise<RenameList_RESPONSE> {
  const { new_NAME, list, user } = args;

  try {
    if (new_NAME === list?.name) return { data: true };

    VALIDATE_args({ new_NAME, list, user });
    await _VALIDATE_listName({ user, new_NAME });
    await _RENAME_withWatermelon({ list, new_NAME });

    return { data: true };
    // -------------------------------------------------
  } catch (error: any) {
    return {
      data: false,
      error: HANDLE_userErrorInsideFinalCatchBlock({
        function_NAME: "RENAME_list",
        error,
        internalErrorUser_MSG: renameList_ERRS.user.defaultInternal_MSG,
      }),
    };
  }
}

const GENERATE_error = (
  data: Omit<RenameListError_PROPS, "function_NAME">
) => ({ ...data, function_NAME: "RENAME_list" });

function VALIDATE_args(arg: RenameList_ARGS) {
  const { list, new_NAME, user } = arg;
  if (!new_NAME) {
    throw GENERATE_error({
      error_TYPE: "form_input",
      user_MSG: renameList_ERRS.user.falsyInput,
      falsyForm_INPUTS: renameList_ERRS.user.noNameProvided_OBJ,
    });
  }

  if (!user) {
    throw GENERATE_error({
      error_TYPE: "internal",
      user_MSG: renameList_ERRS.user.defaultInternal_MSG,
      internal_MSG: renameList_ERRS.internal.userUndefined,
    });
  }

  if (!list) {
    throw GENERATE_error({
      error_TYPE: "internal",
      user_MSG: renameList_ERRS.user.defaultInternal_MSG,
      internal_MSG: renameList_ERRS.internal.listUndefined,
    });
  }
}
async function _VALIDATE_listName({
  user,
  new_NAME,
}: {
  user: User_MODEL | undefined;
  new_NAME: string | undefined;
}) {
  const _IS_listNameTaken = await user?.DOES_userHaveListWithThisName(new_NAME);
  if (_IS_listNameTaken) {
    throw GENERATE_error({
      error_TYPE: "form_input",
      user_MSG: renameList_ERRS.user.falsyInput,
      falsyForm_INPUTS: renameList_ERRS.user.listNameTaken_OBJ,
    });
  }
}
async function _RENAME_withWatermelon({
  list,
  new_NAME,
}: {
  list: List_MODEL | undefined;
  new_NAME: string | undefined;
}) {
  const renamed_LIST = await list?.rename(new_NAME);
  if (!renamed_LIST) {
    throw GENERATE_error({
      error_TYPE: "internal",
      user_MSG: renameList_ERRS.user.defaultInternal_MSG,
      internal_MSG: renameList_ERRS.internal.watermelonRename,
    });
  }
}
