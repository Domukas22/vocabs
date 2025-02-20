//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";

type z_USE_myStarterContent_PROPS = {
  z_myStarterTop4Lists: List_TYPE[];
  z_myStarterTotalListCount: number;
  z_myStarterSavedVocab_COUNT: number;
  z_myStarterAllVocab_COUNT: number;
  z_myStarterDeletedVocab_COUNT: number;

  z_myStarterContentFetch_ERROR: General_ERROR | undefined;
  z_SET_myStarterContentFetch_ERROR: (error: General_ERROR) => void;

  z_SET_myStarterContent: ({
    top4_LISTS,
    savedVocab_COUNT,
    z_myStarterTotalListCount,
    allVocab_COUNT,
    softDeleltedVocab_COUNT,
  }: {
    top4_LISTS: List_TYPE[];
    z_myStarterTotalListCount: number;
    savedVocab_COUNT: number;
    allVocab_COUNT: number;
    softDeleltedVocab_COUNT: number;
  }) => void;

  z_IS_myStarterInitialFetchDone: boolean;
  z_SET_myStarterInitialFetchToTrue: () => void;

  z_IS_myStarterContentRefetching: boolean;
  z_SET_myStarterContentRefetch: (val: boolean) => void;
};

// z = Zustand
// oL == One List
export const z_USE_myStarterContent = create<z_USE_myStarterContent_PROPS>(
  (set) => ({
    z_myStarterTop4Lists: [],
    z_myStarterTotalListCount: 0,
    z_myStarterSavedVocab_COUNT: 0,
    z_myStarterAllVocab_COUNT: 0,
    z_myStarterDeletedVocab_COUNT: 0,

    z_myStarterContentFetch_ERROR: undefined,

    z_SET_myStarterContent: ({
      top4_LISTS = [],
      z_myStarterTotalListCount = 0,
      savedVocab_COUNT = 0,
      allVocab_COUNT = 0,
      softDeleltedVocab_COUNT = 0,
    }) =>
      set({
        z_myStarterTop4Lists: top4_LISTS,
        z_myStarterTotalListCount: z_myStarterTotalListCount,
        z_myStarterSavedVocab_COUNT: savedVocab_COUNT,
        z_myStarterAllVocab_COUNT: allVocab_COUNT,
        z_myStarterDeletedVocab_COUNT: softDeleltedVocab_COUNT,
      }),

    z_IS_myStarterInitialFetchDone: false,
    z_SET_myStarterInitialFetchToTrue: () =>
      set({ z_IS_myStarterInitialFetchDone: true }),

    z_IS_myStarterContentRefetching: false,
    z_SET_myStarterContentRefetch: (val) =>
      set({ z_IS_myStarterContentRefetching: val }),

    z_SET_myStarterContentFetch_ERROR: (error) =>
      set({ z_myStarterContentFetch_ERROR: error }),
  })
);
