//
//
//

import { FETCH_myVocabs_ARG_TYPES, internalErrMsg_TYPES } from "../../../types";

export function VALIDATE_args({
  args,
  THROW_err = () => {},
}: {
  args: FETCH_myVocabs_ARG_TYPES;
  THROW_err: (type: internalErrMsg_TYPES) => void;
}) {
  const { type, user_id, targetList_ID, z_vocabDisplay_SETTINGS } = args;

  if (!user_id) {
    throw THROW_err("user_id_undefined");
  }

  if (!type) {
    throw THROW_err("fetch_type_undefined");
  }

  if (type === "byTargetList" && !targetList_ID) {
    throw THROW_err("target_list_id_undefined");
  }

  if (!z_vocabDisplay_SETTINGS) {
    throw THROW_err("display_settings_undefined");
  }

  if (typeof args?.amount !== "number")
    throw THROW_err("pagination_amount_undefined");
}
