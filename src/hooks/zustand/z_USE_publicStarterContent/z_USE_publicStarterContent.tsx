//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

type z_USE_publicStarterContent_PROPS = {
  z_publicStarterTop5Lists: List_TYPE[];
  z_publicStarterTotalListCount: number;

  z_publicStarterTop5Vocabs: Vocab_TYPE[];
  z_publicStarterTotalVocabCount: number;

  z_publicStarterContentFetch_ERROR: General_ERROR | undefined;
  z_SET_publicStarterContentFetch_ERROR: (error: General_ERROR) => void;

  z_SET_publicStarterContent: ({
    top5_LISTS,
    top5_VOCABS,
    totalList_COUNT,
    totalVocab_COUNT,
  }: {
    top5_LISTS: List_TYPE[];
    top5_VOCABS: Vocab_TYPE[];
    totalList_COUNT: number;
    totalVocab_COUNT: number;
  }) => void;

  z_IS_publicStarterInitialFetchDone: boolean;
  z_SET_publicStarterInitialFetchToTrue: () => void;

  z_IS_publicStarterContentRefetching: boolean;
  z_SET_publicStarterContentRefetch: (val: boolean) => void;
};

// z = Zustand
// oL == One List
export const z_USE_publicStarterContent =
  create<z_USE_publicStarterContent_PROPS>((set) => ({
    z_publicStarterTop5Lists: [],
    z_publicStarterTotalListCount: 0,

    z_publicStarterTop5Vocabs: [],
    z_publicStarterTotalVocabCount: 0,

    z_publicStarterContentFetch_ERROR: undefined,

    z_SET_publicStarterContent: ({
      top5_LISTS = [],
      top5_VOCABS = [],
      totalList_COUNT = 0,
      totalVocab_COUNT = 0,
    }) =>
      set({
        z_publicStarterTop5Lists: top5_LISTS,
        z_publicStarterTop5Vocabs: top5_VOCABS,
        z_publicStarterTotalListCount: totalList_COUNT,
        z_publicStarterTotalVocabCount: totalVocab_COUNT,
      }),

    z_IS_publicStarterInitialFetchDone: false,
    z_SET_publicStarterInitialFetchToTrue: () =>
      set({ z_IS_publicStarterInitialFetchDone: true }),

    z_IS_publicStarterContentRefetching: false,
    z_SET_publicStarterContentRefetch: (val) =>
      set({ z_IS_publicStarterContentRefetching: val }),

    z_SET_publicStarterContentFetch_ERROR: (error) =>
      set({ z_publicStarterContentFetch_ERROR: error }),
  }));
