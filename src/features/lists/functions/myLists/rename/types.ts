//
//
//

import List_MODEL from "@/src/db/models/List_MODEL";
import User_MODEL from "@/src/db/models/User_MODEL";
import { Error_PROPS, FormInputError_PROPS } from "@/src/types/error_TYPES";

type validInput_NAMES = "name";

export type FalsyFormInputArray_PROPS = [
  FormInputError_PROPS<validInput_NAMES>,
  ...FormInputError_PROPS<validInput_NAMES>[]
];

export type RenameList_ARGS = {
  list: List_MODEL | undefined;
  user: User_MODEL | undefined;
  new_NAME: string | undefined;
};

export type RenameList_DATA = boolean;
export type RenameListError_PROPS = Error_PROPS<validInput_NAMES>;

export type RenameList_RESPONSE = {
  data: RenameList_DATA;
  error?: RenameListError_PROPS;
};
