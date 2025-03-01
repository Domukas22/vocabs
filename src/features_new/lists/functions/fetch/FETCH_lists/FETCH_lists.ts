//
//
//

import { FETCH_lists_ARGS, FETCH_lists_RESPONSE_TYPE } from "./types";

import {
  FETCH_finalLists,
  FETCH_unpaginatedListCount,
  VALIDATE_fetchListsArgs,
} from "./helpers";
import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";

export const function_NAME = "FETCH_lists";

export async function FETCH_lists(
  args: FETCH_lists_ARGS
): Promise<FETCH_lists_RESPONSE_TYPE> {
  try {
    // Validate arguments before building query
    VALIDATE_fetchListsArgs(args);

    // Build the supabase query
    let query = supabase.from("lists_extended").select(`*`, { count: "exact" });

    // ---------------------------------------------------
    // Fetch the count BEFORE applying excluded
    const { unpaginated_COUNT } = await FETCH_unpaginatedListCount(query, args);

    // ---------------------------------------------------
    // Fetch final list results with excluded ids applied
    const { lists } = await FETCH_finalLists(query, args);

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return { lists, unpaginated_COUNT };
    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
