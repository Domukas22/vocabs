//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { create } from "zustand";
import { vocabFetch_TYPES } from "../../fetchVocabs/FETCH_vocabs/types";

export type z_PREPARE_publicVocabsForFetch_TYPE = ({
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

export type z_INSERT_publicVocabsError_TYPE = (error: General_ERROR) => void;
//////////////////////////////////////////////////////////////////////////////////////////

type z_USE_publicVocabs_PROPS = {
  z_publicVocabs: Vocab_TYPE[];
  z_publicVocabPrinted_IDS: Set<string>;

  z_publicVocabsFetch_TYPE: vocabFetch_TYPES;

  z_publicVocabsUnpaginated_COUNT: number;
  z_HAVE_publicVocabsReachedEnd: boolean;

  z_publicVocabsLoading_STATE: loadingState_TYPES;
  z_publicVocabs_ERROR?: General_ERROR;

  z_PREPARE_publicVocabsForFetch: z_PREPARE_publicVocabsForFetch_TYPE;
  z_INSERT_fetchedVocabs: z_INSERT_fetchedVocabs_TYPE;
  z_INSERT_publicVocabsError: z_INSERT_publicVocabsError_TYPE;
};

export const z_USE_publicVocabs = create<z_USE_publicVocabs_PROPS>(
  (set, get) => ({
    z_publicVocabs: [],
    z_publicVocabPrinted_IDS: new Set<string>(),

    z_publicVocabsFetch_TYPE: "all",

    z_HAVE_publicVocabsReachedEnd: false,
    z_publicVocabsUnpaginated_COUNT: 0,

    z_publicVocabsLoading_STATE: "none",
    z_publicVocabs_ERROR: undefined,

    z_PREPARE_publicVocabsForFetch: ({
      loadMore,
      loading_STATE,
      fetch_TYPE,
    }) => {
      set({
        z_publicVocabs_ERROR: undefined,
        z_publicVocabsLoading_STATE: loading_STATE,
        z_publicVocabsFetch_TYPE: fetch_TYPE,
      });
      if (!loadMore) set({ z_publicVocabs: [] });
    },

    z_INSERT_fetchedVocabs: ({ vocabs, unpaginated_COUNT, loadMore }) => {
      if (loadMore) {
        const withNewlyAppendedVocab_ARR = [...get().z_publicVocabs, ...vocabs];
        set({
          z_publicVocabs: withNewlyAppendedVocab_ARR,
          z_publicVocabsUnpaginated_COUNT: unpaginated_COUNT,
          z_publicVocabPrinted_IDS: new Set(
            withNewlyAppendedVocab_ARR.map((x) => x.id)
          ),
          z_HAVE_publicVocabsReachedEnd:
            withNewlyAppendedVocab_ARR.length >= unpaginated_COUNT,

          z_publicVocabsLoading_STATE: "none",
        });
      } else {
        set({
          z_publicVocabs: vocabs,
          z_publicVocabsUnpaginated_COUNT: unpaginated_COUNT,
          z_publicVocabPrinted_IDS: new Set(vocabs.map((v) => v.id)),
          z_HAVE_publicVocabsReachedEnd: vocabs.length >= unpaginated_COUNT,
          z_publicVocabsLoading_STATE: "none",
        });
      }
    },
    z_INSERT_publicVocabsError: (error) =>
      set({
        z_publicVocabs: [],
        z_publicVocabsLoading_STATE: "error",
        z_publicVocabs_ERROR: error,
      }),
  })
);
