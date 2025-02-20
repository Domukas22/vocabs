//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";

type z_USE_publicStarterContent_PROPS = {
  z_publicStarterTop3Lists: List_TYPE[];
  z_publicStarterTotalListCount: number;
  z_publicStarterSavedVocab_COUNT: number;
  z_publicStarterAllVocab_COUNT: number;
  z_publicStarterDeletedVocab_COUNT: number;

  z_publicStarterContentFetch_ERROR: General_ERROR | undefined;
  z_SET_publicStarterContentFetch_ERROR: (error: General_ERROR) => void;

  z_SET_publicStarterContent: ({
    top3_LISTS,
    savedVocab_COUNT,
    z_publicStarterTotalListCount,
    allVocab_COUNT,
    softDeleltedVocab_COUNT,
  }: {
    top3_LISTS: List_TYPE[];
    z_publicStarterTotalListCount: number;
    savedVocab_COUNT: number;
    allVocab_COUNT: number;
    softDeleltedVocab_COUNT: number;
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
    z_publicStarterTop3Lists: [],
    z_publicStarterTotalListCount: 0,
    z_publicStarterSavedVocab_COUNT: 0,
    z_publicStarterAllVocab_COUNT: 0,
    z_publicStarterDeletedVocab_COUNT: 0,

    z_publicStarterContentFetch_ERROR: undefined,

    z_SET_publicStarterContent: ({
      top3_LISTS = [],
      z_publicStarterTotalListCount = 0,
      savedVocab_COUNT = 0,
      allVocab_COUNT = 0,
      softDeleltedVocab_COUNT = 0,
    }) =>
      set({
        z_publicStarterTop3Lists: top3_LISTS,
        z_publicStarterTotalListCount: z_publicStarterTotalListCount,
        z_publicStarterSavedVocab_COUNT: savedVocab_COUNT,
        z_publicStarterAllVocab_COUNT: allVocab_COUNT,
        z_publicStarterDeletedVocab_COUNT: softDeleltedVocab_COUNT,
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
