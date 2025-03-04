//
//
//

import { VocabFilter_PROPS } from "@/src/features_new/vocabs/types";
import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type publicVocabsSorting_TYPE = "date" | "saved-count";

interface z_USE_publicVocabsDisplaySettings_PROPS {
  sorting: {
    type: publicVocabsSorting_TYPE;
    direction: sortDirection_TYPE;
  };
  filters: VocabFilter_PROPS;
  appearance: {
    frontTrLang_ID: string;
    SHOW_description: boolean;
  };

  z_HANDLE_langFilter: (toRemoveLang_ID: string) => void;
  z_GET_activeFilterCount: () => number;

  z_SET_sorting: (sorting_TYPE: publicVocabsSorting_TYPE) => void;
  z_SET_sortDirection: (sortDirection_TYPE: sortDirection_TYPE) => void;

  z_TOGGLE_showDescription: () => void;

  z_SET_frontLangId: (newLang_ID: string) => void;
  z_CLEAR_filters: () => void;
}

export const z_USE_publicVocabsDisplaySettings =
  create<z_USE_publicVocabsDisplaySettings_PROPS>((set, get) => ({
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

    z_GET_activeFilterCount: () => get().filters?.langs?.length,

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

    z_TOGGLE_showDescription: () =>
      set((state) => ({
        appearance: {
          ...state.appearance,
          SHOW_description: !state.appearance.SHOW_description,
        },
      })),

    z_SET_frontLangId: (newLang_ID) =>
      set((state) => ({
        appearance: {
          ...state.appearance,
          frontTrLang_ID: newLang_ID,
        },
      })),
    z_CLEAR_filters: () =>
      set({ filters: { byMarked: false, difficulties: [], langs: [] } }),
  }));
