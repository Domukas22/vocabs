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
//////////////////////////////////////////////////////////////////////////////////////////

type z_USE_myVocabs_PROPS = {
  z_myVocabs: Vocab_TYPE[];
  z_myVocabPrinted_IDS: Set<string>;

  z_myVocabsFetch_TYPE: vocabFetch_TYPES;

  z_myVocabsUnpaginated_COUNT: number;
  z_HAVE_myVocabsReachedEnd: boolean;

  z_myVocabsLoading_STATE: loadingState_TYPES;
  z_myVocabs_ERROR?: General_ERROR;

  z_myVocabsHighlighted_ID: string;
  z_myVocabsHighlightTimeoutID: any;

  z_HIGHLIGHT_myVocab: (vocab_ID: string) => void;
  z_UPDATE_vocabInMyVocabsList: (target_VOCAB: Vocab_TYPE) => void;
  z_PREPEND_vocabToMyVocabsList: (new_VOCAB: Vocab_TYPE) => void;
  z_REMOVE_vocabFromMyVocabsList: (vocab_ID: string) => void;

  z_PREPARE_myVocabsForFetch: z_PREPARE_myVocabsForFetch_TYPE;
  z_INSERT_fetchedVocabs: z_INSERT_fetchedVocabs_TYPE;
  z_INSERT_myVocabsError: z_INSERT_myVocabsError_TYPE;
};

export const z_USE_myVocabs = create<z_USE_myVocabs_PROPS>((set, get) => ({
  z_myVocabs: [],
  z_myVocabPrinted_IDS: new Set<string>(),

  z_myVocabsFetch_TYPE: "all",

  z_HAVE_myVocabsReachedEnd: false,
  z_myVocabsUnpaginated_COUNT: 0,

  z_myVocabsLoading_STATE: "none",
  z_myVocabs_ERROR: undefined,

  z_myVocabsHighlighted_ID: "",
  z_myVocabsHighlightTimeoutID: "", // This will hold the reference to the timeout

  z_HIGHLIGHT_myVocab: (vocab_ID: string) => {
    const currentTimeoutID = get().z_myVocabsHighlightTimeoutID;
    // If there is a previous timeout, clear it
    if (currentTimeoutID) {
      clearTimeout(currentTimeoutID);
    }

    // Set the new highlighted vocab ID
    set({ z_myVocabsHighlighted_ID: vocab_ID });

    // Set a new timeout to reset the highlighted vocab ID after 5 seconds
    const timeoutID = setTimeout(() => {
      set({ z_myVocabsHighlighted_ID: "" });
    }, 5000);

    // Save the timeout reference in the state to clear it if needed
    set({ z_myVocabsHighlightTimeoutID: timeoutID });
  },
  z_UPDATE_vocabInMyVocabsList: (updated_VOCAB) =>
    set((state) => ({
      z_myVocabs: [...state.z_myVocabs].map((existing_VOCAB) =>
        existing_VOCAB.id === updated_VOCAB.id ? updated_VOCAB : existing_VOCAB
      ),
    })),
  z_REMOVE_vocabFromMyVocabsList: (vocab_ID) =>
    set((state) => ({
      z_myVocabs: [...state.z_myVocabs].filter((x) => x.id !== vocab_ID),
      z_myVocabsUnpaginated_COUNT: state.z_myVocabsUnpaginated_COUNT - 1,
    })),
  z_PREPEND_vocabToMyVocabsList: (new_VOCAB) =>
    set((state) => ({
      z_myVocabs: [new_VOCAB, ...state.z_myVocabs],
      z_myVocabsUnpaginated_COUNT: state.z_myVocabsUnpaginated_COUNT + 1,
    })),

  z_PREPARE_myVocabsForFetch: ({ loadMore, loading_STATE, fetch_TYPE }) => {
    set({
      z_myVocabs_ERROR: undefined,
      z_myVocabsLoading_STATE: loading_STATE,
      z_myVocabsFetch_TYPE: fetch_TYPE,
    });
    if (!loadMore) set({ z_myVocabs: [] });
  },

  z_INSERT_fetchedVocabs: ({ vocabs, unpaginated_COUNT, loadMore }) => {
    if (loadMore) {
      const withNewlyAppendedVocab_ARR = [...get().z_myVocabs, ...vocabs];
      set({
        z_myVocabs: withNewlyAppendedVocab_ARR,
        z_myVocabsUnpaginated_COUNT: unpaginated_COUNT,
        z_myVocabPrinted_IDS: new Set(
          withNewlyAppendedVocab_ARR.map((x) => x.id)
        ),
        z_HAVE_myVocabsReachedEnd:
          withNewlyAppendedVocab_ARR.length >= unpaginated_COUNT,

        z_myVocabsLoading_STATE: "none",
      });
    } else {
      set({
        z_myVocabs: vocabs,
        z_myVocabsUnpaginated_COUNT: unpaginated_COUNT,
        z_myVocabPrinted_IDS: new Set(vocabs.map((v) => v.id)),
        z_HAVE_myVocabsReachedEnd: vocabs.length >= unpaginated_COUNT,
        z_myVocabsLoading_STATE: "none",
      });
    }
  },
  z_INSERT_myVocabsError: (error) =>
    set({
      z_myVocabs: [],
      z_myVocabsLoading_STATE: "error",
      z_myVocabs_ERROR: error,
    }),
}));
