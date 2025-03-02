//
//
//

import { ListFilter_PROPS } from "@/src/features_new/lists/types";
import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type MyListsSorting_TYPE = "date" | "vocab-count";

interface z_USE_myListsDisplaySettings_PROPS {
  sorting: MyListsSorting_TYPE;
  sortDirection: sortDirection_TYPE;
  filters: ListFilter_PROPS;

  z_SET_sorting: (sorting_TYPE: MyListsSorting_TYPE) => void;
  z_SET_sortDirection: (sortDirection_TYPE: sortDirection_TYPE) => void;

  z_HANDLE_langFilter: (targetLang_ID: string) => void;
  z_HANDLE_difficultyFilter: (difficulty: 1 | 2 | 3) => void;
  z_HANDLE_markedFilter: () => void;

  z_GET_activeFilterCount: () => number;
}

export const z_USE_myListsDisplaySettings =
  create<z_USE_myListsDisplaySettings_PROPS>((set, get) => ({
    sorting: "date",
    sortDirection: "descending",
    filters: {
      byMarked: false,
      difficulties: [],
      langs: [],
    },

    z_HANDLE_langFilter: (targetLang_ID) =>
      set((state) => {
        const IS_langAlreadyApplied =
          state.filters.langs.includes(targetLang_ID);

        if (IS_langAlreadyApplied) {
          const new_LANGS = [...state.filters.langs].filter(
            (lang) => lang !== targetLang_ID
          );

          return { filters: { ...state.filters, langs: new_LANGS } };
        }

        return {
          filters: {
            ...state.filters,
            langs: [targetLang_ID, ...state.filters.langs],
          },
        };
      }),

    z_HANDLE_difficultyFilter: (diff) =>
      set((state) => {
        const IS_diffAlreadyApplied = state.filters.difficulties.includes(diff);

        if (IS_diffAlreadyApplied) {
          const new_DIFFICULTIES = [...state.filters.difficulties].filter(
            (d) => d !== diff
          );
          return {
            filters: { ...state.filters, difficulties: new_DIFFICULTIES },
          };
        }

        return {
          filters: {
            ...state.filters,
            difficulties: [diff, ...state.filters.difficulties],
          },
        };
      }),

    z_HANDLE_markedFilter: () =>
      set((state) => ({
        filters: { ...state.filters, byMarked: !state.filters.byMarked },
      })),

    z_GET_activeFilterCount: () =>
      get().filters?.langs?.length +
      get().filters?.difficulties?.length +
      (get().filters?.byMarked ? 1 : 0),

    z_SET_sorting: (sorting_TYPE) => set({ sorting: sorting_TYPE }),
    z_SET_sortDirection: (sortDirection_TYPE) =>
      set({ sortDirection: sortDirection_TYPE }),
  }));
