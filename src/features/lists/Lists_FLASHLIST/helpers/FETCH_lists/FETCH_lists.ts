//
//
//

import { FETCH_lists_ARGS, FETCH_lists_RESPONSE_TYPE } from "./types";

import {
  BUILD_supabaseQuery,
  FETCH_finalLists,
  FETCH_unpaginatedListCount,
  FORMAT_rawLists,
  VALIDATE_fetchListsArgs,
} from "./helpers";
import { General_ERROR } from "@/src/types/error_TYPES";

export const function_NAME = "FETCH_lists";

export async function FETCH_lists(
  args: FETCH_lists_ARGS
): Promise<FETCH_lists_RESPONSE_TYPE> {
  try {
    // Validate arguments before building query
    VALIDATE_fetchListsArgs(args);

    // Build the supabase query
    let query = BUILD_supabaseQuery(args?.list_TYPE);

    // ---------------------------------------------------
    // Fetch the count BEFORE applying excluded
    const { unpaginated_COUNT } = await FETCH_unpaginatedListCount(query, args);

    // ---------------------------------------------------
    // Fetch final list results with excluded ids applied
    const { lists } = await FETCH_finalLists(query, args);

    // ---------------------------------------------------
    // Transform results into more digestable format
    const { formated_LISTS } = FORMAT_rawLists(lists);

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return { lists: formated_LISTS, unpaginated_COUNT };
    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
