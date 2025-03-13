//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { create } from "zustand";
import {
  REPLACE_vocab,
  REMOVE_vocab,
  PREPEND_vocab,
  PREPARE_vocabsForFetch,
  APPEND_vocabs,
  SET_error,
} from "../_helpers";

type AppendVocabsParams = {
  vocabs: Vocab_TYPE[];
  unpaginated_COUNT: number;
  loadMore: boolean;
};

type PrepareForFetchParams = {
  loadMore: boolean;
  loading_STATE: loadingState_TYPES;
};

export type PREPATE_forFetch_TYPE = (params: PrepareForFetchParams) => void;
export type APPEND_vocabs_TYPE = (params: AppendVocabsParams) => void;
export type SET_error_TYPE = (error: General_ERROR) => void;
export type SET_langIds_TYPE = (lang_ids: string[]) => void;
//////////////////////////////////////////////////////////////////////////////////////////

type z_USE_markedVocabs_PROPS = {
  z_vocabs: Vocab_TYPE[];
  z_lang_IDS: string[];

  z_printed_IDS: Set<string>;
  z_unpaginated_COUNT: number;

  z_loading_STATE: loadingState_TYPES;
  z_HAS_reachedEnd: boolean;
  z_error?: General_ERROR;

  z_REPLACE_vocab: (target_VOCAB: Vocab_TYPE) => void;
  z_PREPEND_vocab: (new_VOCAB: Vocab_TYPE) => void;
  z_REMOVE_vocab: (vocab_ID: string) => void;

  z_PREPATE_forFetch: PREPATE_forFetch_TYPE;
  z_APPEND_vocabs: APPEND_vocabs_TYPE;
  z_SET_error: SET_error_TYPE;
  z_SET_langIds: SET_langIds_TYPE;
};

export const z_USE_markedVocabs = create<z_USE_markedVocabs_PROPS>((set) => ({
  z_vocabs: [],
  z_printed_IDS: new Set<string>(),
  z_lang_IDS: [],

  z_HAS_reachedEnd: false,
  z_unpaginated_COUNT: 0,

  z_loading_STATE: "none",
  z_error: undefined,

  z_REPLACE_vocab: (updated_VOCAB) => set(REPLACE_vocab(updated_VOCAB)),
  z_REMOVE_vocab: (vocab_ID) => set(REMOVE_vocab(vocab_ID)),
  z_PREPEND_vocab: (new_VOCAB) => set(PREPEND_vocab(new_VOCAB)),
  z_PREPATE_forFetch: ({ loadMore, loading_STATE }) =>
    set(PREPARE_vocabsForFetch(loadMore, loading_STATE)),
  z_APPEND_vocabs: ({ vocabs, unpaginated_COUNT, loadMore }) =>
    set(APPEND_vocabs(vocabs, unpaginated_COUNT, loadMore)),
  z_SET_error: (error) => set(SET_error(error)),
  z_SET_langIds: (lang_IDS = []) => set({ z_lang_IDS: lang_IDS }),
}));
