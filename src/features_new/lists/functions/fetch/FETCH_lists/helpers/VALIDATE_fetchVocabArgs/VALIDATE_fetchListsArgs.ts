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

    sorting: { direction, type },

    amount,
    excludeIds,
    sorting,
    filters,
  } = args;

  const err = (message: string) => {
    return new General_ERROR({
      message,
      function_NAME,
    });
  };

  if (!user_id) throw err("'user_id' was undefined");
  if (!list_TYPE) throw err("'list_TYPE' was undefined");

  if (!filters) throw err("'filters' was undefined");
  if (typeof filters.byMarked !== "boolean")
    throw err("'filters.byMarked' was not a boolean");
  if (!filters.difficulties) throw err("'filters.difficulties' was undefined");
  if (!filters.langs) throw err("'filters.langs' was undefined");

  if (!fetch_TYPE) throw err("'fetch_TYPE' was undefined");
  if (fetch_TYPE === "byTargetList" && !list_id)
    throw err("'list_id' undefined");

  if (!sorting) throw err("'sorting' was undefined");
  if (!type) throw err("'sorting.type' was undefined");
  if (!direction) throw err("'sorting.direction' was undefined");
  if (direction !== "ascending" && direction !== "descending")
    err("'sortDirection' was neither ascending nor descending");

  if (!excludeIds) throw err("'excludeIds' was undefined");
  if (typeof amount !== "number") throw err("'amount' was not a number");
  if (typeof search !== "string") throw err("'search' was not a string");
}
