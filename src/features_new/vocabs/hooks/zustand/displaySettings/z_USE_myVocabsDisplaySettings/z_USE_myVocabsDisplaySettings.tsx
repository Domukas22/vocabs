//
//
//

import { VocabFilter_PROPS } from "@/src/features_new/vocabs/types";
import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type myVocabsSorting_TYPE = "difficulty" | "date" | "marked";

interface z_USE_myVocabsDisplaySettings_PROPS {
  sorting: {
    type: myVocabsSorting_TYPE;
    direction: sortDirection_TYPE;
  };
  filters: VocabFilter_PROPS;
  appearance: {
    frontTrLang_ID: string;
    SHOW_description: boolean;
    SHOW_flags: boolean;
    SHOW_difficulty: boolean;
  };

  z_HANDLE_langFilter: (toRemoveLang_ID: string) => void;
  z_HANDLE_difficultyFilter: (toRemove_DIFFICULTY: 1 | 2 | 3) => void;
  z_GET_activeFilterCount: () => number;

  z_SET_sorting: (sorting_TYPE: myVocabsSorting_TYPE) => void;
  z_SET_sortDirection: (sortDirection_TYPE: sortDirection_TYPE) => void;
  z_HANDLE_markedFilter: () => void;

  z_TOGGLE_showDescription: () => void;
  z_TOGGLE_showFlags: () => void;
  z_TOGGLE_showDifficulty: () => void;

  z_SET_frontLangId: (newLang_ID: string) => void;
}

export const z_USE_myVocabsDisplaySettings =
  create<z_USE_myVocabsDisplaySettings_PROPS>((set, get) => ({
    sorting: {
      type: "date",
      direction: "descending",
    },

    filters: {
      byMarked: false,
      difficulties: [],
      langs: [],
    },
    appearance: {
      frontTrLang_ID: "en",
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
    },

    z_GET_activeFilterCount: () =>
      get().filters?.langs?.length +
      get().filters?.difficulties?.length +
      (get().filters?.byMarked ? 1 : 0),

    z_SET_sorting: (sorting_TYPE) =>
      set((state) => ({
        sorting: {
          ...state.sorting,
          type: sorting_TYPE,
        },
      })),

    z_SET_sortDirection: (sortDirection_TYPE) =>
      set((state) => ({
        sorting: {
          ...state.sorting,
          direction: sortDirection_TYPE,
        },
      })),

    z_HANDLE_markedFilter: () =>
      set((state) => ({
        filters: { ...state.filters, byMarked: !state.filters.byMarked },
      })),

    z_TOGGLE_showDescription: () =>
      set((state) => ({
        appearance: {
          ...state.appearance,
          SHOW_description: !state.appearance.SHOW_description,
        },
      })),

    z_TOGGLE_showFlags: () =>
      set((state) => ({
        appearance: {
          ...state.appearance,
          SHOW_flags: !state.appearance.SHOW_flags,
        },
      })),

    z_TOGGLE_showDifficulty: () =>
      set((state) => ({
        appearance: {
          ...state.appearance,
          SHOW_difficulty: !state.appearance.SHOW_difficulty,
        },
      })),

    z_SET_frontLangId: (newLang_ID) =>
      set((state) => ({
        appearance: {
          ...state.appearance,
          frontTrLang_ID: newLang_ID,
        },
      })),

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
  }));
