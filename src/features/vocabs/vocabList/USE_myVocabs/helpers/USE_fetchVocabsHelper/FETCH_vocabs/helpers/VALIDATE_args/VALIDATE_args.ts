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

  if (!user_id) throw { message: "User id undefined" };
  if (!fetch_TYPE) throw { message: "User id undefined" };
  if (!list_TYPE) throw { message: "List type undefined" };

  if (fetch_TYPE === "byTargetList" && !targetList_ID)
    throw { message: "targetList_ID undefined" };

  if (!langFilters) throw { message: "Language filters undefined" };
  if (!difficultyFilters) throw { message: "Difficulty filters undefined" };
  if (!sortDirection) throw { message: "Sort direction undefined" };
  if (!sorting) throw { message: "Sorting direction undefined" };
  if (!excludeIds) throw { message: "Excluded ids undefined" };

  if (typeof amount !== "number")
    throw { message: "Pagination amount undefined" };

  if (typeof search !== "string") throw { message: "Search was not a string" };
}
