//
//
//

import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type myListsSorting_TYPE = "date" | "vocab-count";

export type z_myListsDisplaySettings_PROPS = {
  sorting: myListsSorting_TYPE;
  sortDirection: sortDirection_TYPE;
  langFilters: string[];
  allCollectedLang_IDs: string[];
  difficulty_FILTERS: (1 | 2 | 3)[];
  SHOULD_filterByMarked: boolean;
};

interface z_USE_myListsDisplaySettings_PROPS {
  z_myListDisplay_SETTINGS: z_myListsDisplaySettings_PROPS;
  z_SET_myListDisplaySettings: (
    new_SETTINGS: Partial<z_myListsDisplaySettings_PROPS>
  ) => void;

  z_HANDLE_langFilter: (targetLang_ID: string) => void;
  z_HANDLE_difficultyFilter: (difficulty: 1 | 2 | 3) => void;
  z_GET_activeFilterCount: () => number;
  z_SET_sorting: (sorting_TYPE: myListsSorting_TYPE) => void;
  z_SET_sortDirection: (sortDirection_TYPE: sortDirection_TYPE) => void;
  z_SET_allCollectedLangIds: (lang_IDs: string[]) => void;
  z_TOGGLE_filterByMarked: () => void;
}

export const z_USE_myListsDisplaySettings =
  create<z_USE_myListsDisplaySettings_PROPS>((set, get) => ({
    z_myListDisplay_SETTINGS: {
      sorting: "date",
      sortDirection: "descending",
      allCollectedLang_IDs: [],
      langFilters: [],
      difficulty_FILTERS: [],
      SHOULD_filterByMarked: false,
    },

    z_SET_myListDisplaySettings: (new_SETTINGS) => {
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          ...new_SETTINGS,
        },
      }));
    },

    z_HANDLE_langFilter: (targetLang_ID) =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          langFilters: state.z_myListDisplay_SETTINGS.langFilters?.some(
            (lang) => lang === targetLang_ID
          )
            ? state.z_myListDisplay_SETTINGS.langFilters.filter(
                (lang_id) => lang_id !== targetLang_ID
              )
            : [...state.z_myListDisplay_SETTINGS.langFilters, targetLang_ID],
        },
      })),

    z_HANDLE_difficultyFilter: (difficulty) =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          difficulty_FILTERS:
            state.z_myListDisplay_SETTINGS.difficulty_FILTERS?.some(
              (diff) => diff === difficulty
            )
              ? state.z_myListDisplay_SETTINGS.difficulty_FILTERS.filter(
                  (diff) => diff !== difficulty
                )
              : [
                  ...state.z_myListDisplay_SETTINGS.difficulty_FILTERS,
                  difficulty,
                ],
        },
      })),
    z_TOGGLE_filterByMarked: () =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          SHOULD_filterByMarked:
            !state.z_myListDisplay_SETTINGS.SHOULD_filterByMarked,
        },
      })),

    z_GET_activeFilterCount: () =>
      get().z_myListDisplay_SETTINGS?.langFilters?.length +
      get().z_myListDisplay_SETTINGS?.difficulty_FILTERS?.length +
      (get().z_myListDisplay_SETTINGS?.SHOULD_filterByMarked ? 1 : 0),

    z_SET_sorting: (sorting_TYPE) =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          sorting: sorting_TYPE,
        },
      })),

    z_SET_sortDirection: (sortDirection_TYPE) =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          sortDirection: sortDirection_TYPE,
        },
      })),
    z_SET_allCollectedLangIds: (lang_IDs) =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          allCollectedLang_IDs: lang_IDs,
        },
      })),
  }));
