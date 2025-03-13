//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { create } from "zustand";

import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";

export type z_PREPARE_myVocabsForFetch_TYPE = ({
  loadMore,
  loading_STATE,
  fetch_TYPE,
}: {
  loadMore: boolean;
  loading_STATE: loadingState_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
}) => void;

export type z_INSERT_fetchedVocabs_TYPE = ({
  vocabs,
  unpaginated_COUNT,
  loadMore,
}: {
  vocabs: Vocab_TYPE[];
  unpaginated_COUNT: number;
  loadMore: boolean;
}) => void;

export type z_INSERT_myVocabsError_TYPE = (error: General_ERROR) => void;
export type z_SET_myVocabsCollectedLangIds_TYPE = (lang_ids: string[]) => void;
//////////////////////////////////////////////////////////////////////////////////////////

type z_USE_myVocabs_PROPS = {
  z_vocabs: Vocab_TYPE[];
  z_printed_IDS: Set<string>;
  z_lang_IDS: string[];

  z_fetch_TYPE: vocabFetch_TYPES;

  z_unpaginated_COUNT: number;
  z_HAS_reachedEnd: boolean;

  z_loading_STATE: loadingState_TYPES;
  z_error?: General_ERROR;

  z_highlighted_ID: string;
  z_highlightTimeoutID: any;

  z_HIGHLIGHT_myVocab: (vocab_ID: string) => void;
  z_UPDATE_vocab: (target_VOCAB: Vocab_TYPE) => void;
  z_PREPEND_vocab: (new_VOCAB: Vocab_TYPE) => void;
  z_REMOVE_vocab: (vocab_ID: string) => void;

  z_PREPARE_vocabsFetch: z_PREPARE_myVocabsForFetch_TYPE;
  z_APPEND_vocabs: z_INSERT_fetchedVocabs_TYPE;
  z_SET_error: z_INSERT_myVocabsError_TYPE;

  z_SET_langIds: z_SET_myVocabsCollectedLangIds_TYPE;
};

export const z_USE_myVocabs = create<z_USE_myVocabs_PROPS>((set, get) => ({
  z_vocabs: [],
  z_printed_IDS: new Set<string>(),
  z_lang_IDS: [],

  z_fetch_TYPE: "all",

  z_HAS_reachedEnd: false,
  z_unpaginated_COUNT: 0,

  z_loading_STATE: "none",
  z_error: undefined,

  z_highlighted_ID: "",
  z_highlightTimeoutID: "", // This will hold the reference to the timeout

  z_HIGHLIGHT_myVocab: (vocab_ID: string) => {
    const currentTimeoutID = get().z_highlightTimeoutID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ z_highlighted_ID: vocab_ID });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ z_highlighted_ID: "" });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ z_highlightTimeoutID: timeoutID });
  },
  z_UPDATE_vocab: (updated_VOCAB) =>
    set((state) => ({
      z_vocabs: [...state.z_vocabs].map((existing_VOCAB) =>
        existing_VOCAB.id === updated_VOCAB.id ? updated_VOCAB : existing_VOCAB
      ),
    })),
  z_REMOVE_vocab: (vocab_ID) =>
    set((state) => ({
      z_vocabs: [...state.z_vocabs].filter((x) => x.id !== vocab_ID),
      z_unpaginated_COUNT: state.z_unpaginated_COUNT - 1,
    })),
  z_PREPEND_vocab: (new_VOCAB) =>
    set((state) => ({
      z_vocabs: [new_VOCAB, ...state.z_vocabs],
      z_unpaginated_COUNT: state.z_unpaginated_COUNT + 1,
    })),

  z_PREPARE_vocabsFetch: ({ loadMore, loading_STATE, fetch_TYPE }) => {
    set({
      z_error: undefined,
      z_loading_STATE: loading_STATE,
      z_fetch_TYPE: fetch_TYPE,
    });
    if (!loadMore) set({ z_vocabs: [] });
  },

  z_APPEND_vocabs: ({ vocabs, unpaginated_COUNT, loadMore }) => {
    if (loadMore) {
      const withNewlyAppendedVocab_ARR = [...get().z_vocabs, ...vocabs];
      set({
        z_vocabs: withNewlyAppendedVocab_ARR,
        z_unpaginated_COUNT: unpaginated_COUNT,
        z_printed_IDS: new Set(withNewlyAppendedVocab_ARR.map((x) => x.id)),
        z_HAS_reachedEnd:
          withNewlyAppendedVocab_ARR.length >= unpaginated_COUNT,

        z_loading_STATE: "none",
      });
    } else {
      set({
        z_vocabs: vocabs,
        z_unpaginated_COUNT: unpaginated_COUNT,
        z_printed_IDS: new Set(vocabs.map((v) => v.id)),
        z_HAS_reachedEnd: vocabs.length >= unpaginated_COUNT,
        z_loading_STATE: "none",
      });
    }
  },
  z_SET_error: (error) =>
    set({
      z_vocabs: [],
      z_loading_STATE: "error",
      z_error: error,
    }),

  z_SET_langIds: (lang_ids = []) =>
    set({
      z_lang_IDS: lang_ids,
    }),
}));
