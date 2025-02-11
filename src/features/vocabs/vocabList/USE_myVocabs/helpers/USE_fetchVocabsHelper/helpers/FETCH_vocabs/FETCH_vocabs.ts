//
//
//

import { supabase } from "@/src/lib/supabase";

import {
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_RESPONSE_TYPE,
} from "./types";

import {
  FETCH_finalVocabs,
  FETCH_unpaginatedVocabCount,
  VALIDATE_args,
} from "./helpers";
import { TRANSFORM_error } from "@/src/utils/TRANSFORM_error/TRANSFORM_error";

export const function_NAME = "FETCH_myVocabs";

export async function FETCH_vocabs(
  args: FETCH_myVocabs_ARG_TYPES
): Promise<FETCH_myVocabs_RESPONSE_TYPE> {
  try {
    // Validate arguments before building query
    VALIDATE_args(args);

    // Build the supabase query
    let query = supabase
      .from("vocabs")
      .select(`*, list:lists (id,name)`, { count: "exact" });

    // ---------------------------------------------------
    // Fetch the count BEFORE applying excluded
    const { unpaginated_COUNT } = await FETCH_unpaginatedVocabCount(
      query,
      args
    );

    // ---------------------------------------------------
    // Fetch final vocab results with excluded ids applied
    const { vocabs } = await FETCH_finalVocabs(query, args);

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return {
      data: {
        vocabs,
        unpaginated_COUNT,
      },
    };
    // ---------------------------------------------------
  } catch (error: any) {
    return { error: TRANSFORM_error(function_NAME, error) };
  }
}
