//
//
//

import { CREATE_internalErrorMsg } from "@/src/constants/globalVars";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { z_vocabDisplaySettings_PROPS } from "@/src/hooks/USE_zustand/USE_zustand";
import { Error_PROPS } from "@/src/props";

export interface FETCH_myVocabs_ARG_TYPES {
  user_id: string;
  type: "byTargetList" | "allVocabs" | "deletedVocabs" | "marked";
  targetList_ID?: string;
  search: string;
  amount: number;
  excludeIds: Set<string>;
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
}

export type FETCH_myVocabs_ERROR_PROPS = Error_PROPS;

export type FETCH_myVocabs_RESPONSE_TYPE = {
  data?: {
    vocabs: Vocab_MODEL[];
    unpaginated_COUNT: number;
  };
  error?: FETCH_myVocabs_ERROR_PROPS;
};

////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////

export type internalErrMsg_TYPES =
  | "user_id_undefined"
  | "fetch_type_undefined"
  | "target_list_id_undefined"
  | "display_settings_undefined"
  | "pagination_amount_undefined"
  | "undefined_watermelon_totalCount"
  | "undefined_watermelon_vocabs";

export type userErrMsg_TYPES = "defaultInternal_MSG" | "networkFailure";

type internalErrObj_PROPS = Record<internalErrMsg_TYPES, string>;
type userErrObj_PROPS = Record<userErrMsg_TYPES, string>;

const action = "fetching my vocabs";

export const FETCH_myVocabs_ERRORS: {
  internal: internalErrObj_PROPS;
  user: userErrObj_PROPS;
} = {
  internal: {
    user_id_undefined: `User id undefined when ${action}.`,
    fetch_type_undefined: `Fetch type undefined when ${action}.`,
    target_list_id_undefined: `Tried ${action} by target list, but targetList_ID was undefined`,
    display_settings_undefined: `Display settings undefined when ${action}.`,
    pagination_amount_undefined: `Pagination end undefined when ${action}.`,
    undefined_watermelon_totalCount: `totalCount did not return a number from WatermelonDB ${action}.`,
    undefined_watermelon_vocabs: `vocabs did not return an array from WatermelonDB ${action}.`,
  },
  user: {
    defaultInternal_MSG: CREATE_internalErrorMsg("trying to fetch your vocabs"),
    networkFailure: "There seems to an issue with your internet connection.",
  },
};
