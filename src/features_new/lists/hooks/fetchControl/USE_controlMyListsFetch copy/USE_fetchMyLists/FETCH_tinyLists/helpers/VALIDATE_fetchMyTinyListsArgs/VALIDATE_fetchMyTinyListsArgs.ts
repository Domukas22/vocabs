//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myTinyLists_ARGS } from "../../types";

const function_NAME = "VALIDATE_fetchMyTinyListsArgs";

export function VALIDATE_fetchMyTinyListsArgs(args: FETCH_myTinyLists_ARGS) {
  const { search, user_id, amount, excludeIds } = args;

  const err = (message: string) => {
    return new General_ERROR({
      message,
      function_NAME,
    });
  };

  if (!user_id) throw err("'user_id' was undefined");
  if (!excludeIds) throw err("'excludeIds' was undefined");
  if (typeof amount !== "number") throw err("'amount' was not a number");
  if (typeof search !== "string") throw err("'search' was not a string");
}
