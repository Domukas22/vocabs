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
    filters,
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

  if (!filters) throw err("'filters' was undefined");
  if (typeof filters.byMarked !== "boolean")
    throw err("'filters.byMarked' was not a boolean");
  if (!filters.difficulties) throw err("'filters.difficulties' was undefined");
  if (!filters.langs) throw err("'filters.langs' was undefined");

  if (!sorting) throw err("'sorting' was undefined");
  if (!sorting.type) throw err("'sorting.type' was undefined");
  if (!sorting.direction) throw err("'sorting.direction' was undefined");

  if (!excludeIds) throw err("Excluded ids undefined");

  if (typeof amount !== "number") throw err("Pagination amount undefined");

  if (typeof search !== "string") throw err("Search was not a string");
}
