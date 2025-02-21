//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { FETCH_myVocabs_ARG_TYPES } from "../../types";

const function_NAME = "VALIDATE_fetchVocabArgs";

export function VALIDATE_fetchVocabArgs(args: FETCH_myVocabs_ARG_TYPES) {
  const {
    fetch_TYPE,
    user_id,
    list_id,
    langFilters,
    difficultyFilters,
    sortDirection,
    sorting,
    amount,
    excludeIds,
    search,
    list_TYPE,
  } = args;

  const err = (message: string) => {
    return new General_ERROR({
      message,
      function_NAME,
    });
  };

  if (!user_id && list_TYPE === "private") throw err("User id undefined");
  if (!fetch_TYPE) throw err("Fetch type undefined");
  if (!list_TYPE) throw err("List type undefined");

  if (fetch_TYPE === "byTargetList" && !list_id)
    throw err("targetList_ID undefined");

  if (!langFilters) throw err("Language filters undefined");
  if (!difficultyFilters) throw err("Difficulty filters undefined");
  if (!sortDirection) throw err("Sort direction undefined");
  if (sortDirection !== "ascending" && sortDirection !== "descending")
    err("'sortDirection' was neither ascending nor descending");

  if (!sorting) throw err("Sorting direction undefined");
  if (!excludeIds) throw err("Excluded ids undefined");

  if (typeof amount !== "number") throw err("Pagination amount undefined");

  if (typeof search !== "string") throw err("Search was not a string");
}
