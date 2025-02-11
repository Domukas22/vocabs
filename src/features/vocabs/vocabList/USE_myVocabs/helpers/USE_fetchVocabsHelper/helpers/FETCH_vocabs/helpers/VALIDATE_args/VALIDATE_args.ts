//
//
//

import { FETCH_myVocabs_ARG_TYPES } from "../../types";

export function VALIDATE_args(args: FETCH_myVocabs_ARG_TYPES) {
  const {
    fetch_TYPE,
    user_id,
    targetList_ID,
    langFilters,
    difficultyFilters,
    sortDirection,
    sorting,
    amount,
    excludeIds,
    search,
    list_TYPE,
  } = args;

  if (!user_id) throw new Error("User id undefined");
  if (!fetch_TYPE) throw new Error("Fetch type undefined");
  if (!list_TYPE) throw new Error("List type undefined");

  if (fetch_TYPE === "byTargetList" && !targetList_ID)
    throw new Error("targetList_ID undefined");

  if (!langFilters) throw new Error("Language filters undefined");
  if (!difficultyFilters) throw new Error("Difficulty filters undefined");
  if (!sortDirection) throw new Error("Sort direction undefined");
  if (!sorting) throw new Error("Sorting direction undefined");
  if (!excludeIds) throw new Error("Excluded ids undefined");

  if (typeof amount !== "number")
    throw new Error("Pagination amount undefined");

  if (typeof search !== "string") throw new Error("Search was not a string");
}
