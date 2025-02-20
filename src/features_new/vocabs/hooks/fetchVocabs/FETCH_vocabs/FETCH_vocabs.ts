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
  FORMAT_rawVocabs,
  VALIDATE_fetchVocabArgs,
} from "./functions";
import { General_ERROR } from "@/src/types/error_TYPES";
import { raw_Vocab_TYPE, Vocab_TYPE, VocabTr_TYPE } from "../../../types";

//////////////////////////////////////////////////////////////

export const function_NAME = "FETCH_vocabs";

export async function FETCH_vocabs(
  args: FETCH_myVocabs_ARG_TYPES
): Promise<FETCH_myVocabs_RESPONSE_TYPE> {
  try {
    // Validate arguments before building query
    VALIDATE_fetchVocabArgs(args);

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
    // Transform results into more digestable format
    const { formated_VOCABS } = FORMAT_rawVocabs(vocabs);

    // ---------------------------------------------------
    // Return valid data if fetch was successful
    return { vocabs: formated_VOCABS, unpaginated_COUNT };
    // ---------------------------------------------------
  } catch (error: any) {
    throw new General_ERROR({
      function_NAME: error?.function_NAME || function_NAME,
      message: error?.message,
      errorToSpread: error,
    });
  }
}
