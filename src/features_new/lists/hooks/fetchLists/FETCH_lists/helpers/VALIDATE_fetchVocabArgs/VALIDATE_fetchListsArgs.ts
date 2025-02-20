//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_lists_ARGS } from "../../types";

const function_NAME = "VALIDATE_fetchVocabArgs";

export function VALIDATE_fetchListsArgs(args: FETCH_lists_ARGS) {
  const {
    search,
    user_id,
    list_TYPE,
    fetch_TYPE,
    list_id,
    langFilters,
    sortDirection,

    amount,
    excludeIds,
  } = args;

  const err = (message: string) => {
    return new General_ERROR({
      message,
      function_NAME,
    });
  };

  if (!user_id) throw err("'user_id' was undefined");
  if (!list_TYPE) throw err("'list_TYPE' was undefined");
  if (!langFilters) throw err("'langFilters' was undefined");

  if (!fetch_TYPE) throw err("'fetch_TYPE' was undefined");
  if (fetch_TYPE === "byTargetList" && !list_id)
    throw err("'list_id' undefined");

  if (!sortDirection) throw err("'sortDirection' was undefined");
  if (sortDirection !== "ascending" && sortDirection !== "descending")
    err("'sortDirection' was neither ascending nor descending");

  if (!excludeIds) throw err("'excludeIds' was undefined");
  if (typeof amount !== "number") throw err("'amount' was not a number");
  if (typeof search !== "string") throw err("'search' was not a string");
}
