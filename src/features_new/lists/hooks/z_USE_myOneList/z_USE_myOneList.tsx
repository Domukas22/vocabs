//
//
//

import {
  currentVocabAction_TYPE,
  raw_Vocab_TYPE,
} from "@/src/features/vocabs/types";
import { IS_vocabMarkedBeingUpdated } from "@/src/features/vocabs/vocabList/USE_markVocab/helpers";
import { UPDATE_vocabMarked } from "@/src/features_new/vocabs/functions/update/marked/UPDATE_vocabMarked/UPDATE_vocabMarked";
import { FETCH_vocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers";
import {
  myVocabFetch_TYPES,
  list_TYPES,
} from "@/src/features_new/vocabs/functions/fetch/FETCH_vocabs/types";
import {
  IS_vocabMarkedBeingDeleted,
  SOFTDELETE_vocab,
} from "@/src/features/vocabs/vocabList/USE_softDeleteVocab/helpers";
import {
  IS_vocabDifficultyBeingUpdated,
  UPDATE_vocabDifficulty,
} from "@/src/features/vocabs/vocabList/USE_updateVocabDifficulty/helpers";
import { FETCH_oneList } from "@/src/features_new/vocabs/Vocabs_FLASHLIST/helpers/functions/FETCH_oneList/FETCH_oneList";
import { General_ERROR } from "@/src/types/error_TYPES";
import {
  raw_List_TYPE,
  loadingState_TYPES,
  List_TYPE,
} from "@/src/types/general_TYPES";
import { SEND_internalError } from "@/src/utils";
import DETERMINE_loadingState from "@/src/utils/DETERMINE_loadingState/DETERMINE_loadingState";
import { create } from "zustand";

import { HARDDELETE_vocab } from "../../../vocabs/functions/delete/HARDDELETE_vocab/HARDDELETE_vocab";
import { t } from "i18next";

export type z_FETCH_vocabsArgument_TYPES = {
  search: string;
  signal: AbortSignal;
  amount: number;
  user_id: string;
  list_id: string;
  list_TYPE: list_TYPES;

  fetch_TYPE: myVocabFetch_TYPES;
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date";

  loadMore: boolean;
};

type z_USE_myVocabs_PROPS = {
  z_myOneList: List_TYPE | undefined;
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];
};

// z = Zustand
// oL == One List
export const z_USE_myOneList = create<z_USE_myVocabs_PROPS>((set, get) => ({
  z_myOneList: undefined,
  z_myVocabsCurrent_ACTIONS: [],
  // loading state

  // Update name
  // Reset all vocabs to difficulty 3
  // Update default lang ids
  // z_SET_myOneList
  // z_FETCH_myOneListById
  // Delete
}));
