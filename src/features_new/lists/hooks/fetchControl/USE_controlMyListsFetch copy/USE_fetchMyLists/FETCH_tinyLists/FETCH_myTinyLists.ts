//
//
//

import {
  FETCH_finalMyTinyLists,
  FETCH_unpaginatedMyTinyListCount,
  VALIDATE_fetchMyTinyListsArgs,
} from "./helpers";
import { General_ERROR } from "@/src/types/error_TYPES";
import { supabase } from "@/src/lib/supabase";
import {
  FETCH_myTinyLists_ARGS,
  FETCH_myTinyLists_RESPONSE_TYPE,
} from "./types";

export const function_NAME = "FETCH_myTinyLists";

export async function FETCH_myTinyLists(
  args: FETCH_myTinyLists_ARGS
): Promise<FETCH_myTinyLists_RESPONSE_TYPE> {
  try {
    // Validate arguments before building query
    VALIDATE_fetchMyTinyListsArgs(args);

    // Build the supabase query
    let query = supabase.from("lists").select(`id, name`, { count: "exact" });

    // ---------------------------------------------------
    // Fetch the count BEFORE applying excluded
    const { unpaginated_COUNT } = await FETCH_unpaginatedMyTinyListCount(
      query,
      args
    );

    // ---------------------------------------------------
    // Fetch final list results with excluded ids applied
    const { tiny_LISTS = [] } = await FETCH_finalMyTinyLists(query, args);

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return { tiny_LISTS, unpaginated_COUNT };
    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
