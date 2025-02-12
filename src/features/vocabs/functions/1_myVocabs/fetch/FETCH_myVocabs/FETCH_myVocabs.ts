//
//
//

import { Vocabs_DB } from "@/src/db";
import {
  FETCH_myVocabs_ARG_TYPES,
  FETCH_myVocabs_ERRORS,
  FETCH_myVocabs_RESPONSE_TYPE,
  internalErrMsg_TYPES,
} from "./types";

import { HANDLE_userErrorInsideFinalCatchBlock } from "@/src/utils";
import {
  GET_fetchMyVocabConditions,
  VALIDATE_args,
  VALIDATE_watermelonFetch,
} from "./helpers";
import { Error_PROPS } from "@/src/props";

/////////////////////////////////////////////////////////////////////////////////

export const function_NAME = "FETCH_myVocabs";
export const err = FETCH_myVocabs_ERRORS;

function THROW_err(type: internalErrMsg_TYPES): Error_PROPS {
  return {
    error_TYPE: "internal",
    internal_MSG: err.internal[type],
    user_MSG: err.user.defaultInternal_MSG,
    function_NAME,
  };
}

/////////////////////////////////////////////////////////////////////////////////

export async function FETCH_myVocabs(
  args: FETCH_myVocabs_ARG_TYPES
): Promise<FETCH_myVocabs_RESPONSE_TYPE> {
  try {
    VALIDATE_args({ args, THROW_err });
    const query = Vocabs_DB?.query();

    // get conditions for filter / sorting / pagination
    const { filter_CONDITIONS, sorting_CONDITIONS, pagination_CONDITIONS } =
      GET_fetchMyVocabConditions(args);

    // fetch total result count before pagination
    // -- This must be here, because we want to fetch the total count of filtered results,
    // -- not just the total vocab count in this list
    const unpaginated_COUNT =
      (await query.extend(filter_CONDITIONS.withoutExcluded).fetchCount()) || 0;

    // fetch the final vocabs
    const vocabs = await query
      .extend(
        filter_CONDITIONS.withExluded,
        sorting_CONDITIONS,
        pagination_CONDITIONS
      )
      .fetch();

    VALIDATE_watermelonFetch({ unpaginated_COUNT, vocabs, THROW_err });

    return {
      data: {
        vocabs,
        unpaginated_COUNT,
      },
    };
  } catch (error: any) {
    return {
      error: HANDLE_userErrorInsideFinalCatchBlock({
        error,
        function_NAME,
        internalErrorUser_MSG: err.user.defaultInternal_MSG,
      }),
    };
  }
}
