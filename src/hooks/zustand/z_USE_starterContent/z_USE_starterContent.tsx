//
//
//

import { General_ERROR } from "@/src/types/error_TYPES";
import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";

type z_USE_starterContent_PROPS = {
  z_starterTop3Lists: List_TYPE[];
  z_starterTotalListCount: number;
  z_starterSavedVocab_COUNT: number;
  z_starterAllVocab_COUNT: number;
  z_starterDeletedVocab_COUNT: number;

  z_starterContentFetch_ERROR: General_ERROR | undefined;
  z_SET_starterContentFetch_ERROR: (error: General_ERROR) => void;

  z_SET_starterContent: ({
    top3_LISTS,
    savedVocab_COUNT,
    z_starterTotalListCount,
    allVocab_COUNT,
    softDeleltedVocab_COUNT,
  }: {
    top3_LISTS: List_TYPE[];
    z_starterTotalListCount: number;
    savedVocab_COUNT: number;
    allVocab_COUNT: number;
    softDeleltedVocab_COUNT: number;
  }) => void;

  z_IS_starterInitialFetchDone: boolean;
  z_SET_starterInitialFetchToTrue: () => void;

  z_IS_starterContentRefetching: boolean;
  z_SET_starterContentRefetch: (val: boolean) => void;
};

// z = Zustand
// oL == One List
export const z_USE_starterContent = create<z_USE_starterContent_PROPS>(
  (set) => ({
    z_starterTop3Lists: [],
    z_starterTotalListCount: 0,
    z_starterSavedVocab_COUNT: 0,
    z_starterAllVocab_COUNT: 0,
    z_starterDeletedVocab_COUNT: 0,

    z_starterContentFetch_ERROR: undefined,

    z_SET_starterContent: ({
      top3_LISTS = [],
      z_starterTotalListCount = 0,
      savedVocab_COUNT = 0,
      allVocab_COUNT = 0,
      softDeleltedVocab_COUNT = 0,
    }) =>
      set({
        z_starterTop3Lists: top3_LISTS,
        z_starterTotalListCount: z_starterTotalListCount,
        z_starterSavedVocab_COUNT: savedVocab_COUNT,
        z_starterAllVocab_COUNT: allVocab_COUNT,
        z_starterDeletedVocab_COUNT: softDeleltedVocab_COUNT,
      }),

    z_IS_starterInitialFetchDone: false,
    z_SET_starterInitialFetchToTrue: () =>
      set({ z_IS_starterInitialFetchDone: true }),

    z_IS_starterContentRefetching: false,
    z_SET_starterContentRefetch: (val) =>
      set({ z_IS_starterContentRefetching: val }),

    z_SET_starterContentFetch_ERROR: (error) =>
      set({ z_starterContentFetch_ERROR: error }),
  })
);
