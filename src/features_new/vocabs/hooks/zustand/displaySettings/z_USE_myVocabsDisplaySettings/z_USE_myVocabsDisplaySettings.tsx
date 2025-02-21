//
//
//

import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type myVocabsSorting_TYPE = "difficulty" | "date" | "marked";

export type z_myVocabsDisplaySettings_PROPS = {
  frontTrLang_ID: string;

  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;

  sorting: myVocabsSorting_TYPE;
  sortDirection: sortDirection_TYPE;

  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
};

interface z_USE_myVocabsDisplaySettings_PROPS {
  z_myVocabDisplay_SETTINGS: z_myVocabsDisplaySettings_PROPS;
  z_SET_myVocabDisplaySettings: (
    new_SETTINGS: Partial<z_myVocabsDisplaySettings_PROPS>
  ) => void;
  z_REMOVE_langFilter: (toRemoveLang_ID: string) => void;
  z_REMOVE_difficultyFilter: (toRemove_DIFFICULTY: 1 | 2 | 3) => void;
  z_GET_activeFilterCount: () => void;
}

export const z_USE_myVocabsDisplaySettings =
  create<z_USE_myVocabsDisplaySettings_PROPS>((set, get) => ({
    z_myVocabDisplay_SETTINGS: {
      frontTrLang_ID: "en",

      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,

      sorting: "date",
      sortDirection: "descending",

      difficultyFilters: [],
      langFilters: [],
    },

    z_SET_myVocabDisplaySettings: (new_SETTINGS) => {
      set((state) => ({
        z_myVocabDisplay_SETTINGS: {
          ...state.z_myVocabDisplay_SETTINGS,
          ...new_SETTINGS,
        },
      }));
    },

    z_REMOVE_langFilter: (toRemoveLang_ID) =>
      set((state) => ({
        z_myVocabDisplay_SETTINGS: {
          ...state.z_myVocabDisplay_SETTINGS,
          langFilters: state.z_myVocabDisplay_SETTINGS.langFilters.filter(
            (lang_id) => lang_id !== toRemoveLang_ID
          ),
        },
      })),
    z_REMOVE_difficultyFilter: (toRemove_DIFFICULTY) =>
      set((state) => ({
        z_myVocabDisplay_SETTINGS: {
          ...state.z_myVocabDisplay_SETTINGS,
          difficultyFilters:
            state.z_myVocabDisplay_SETTINGS.difficultyFilters.filter(
              (difficulty) => difficulty !== toRemove_DIFFICULTY
            ),
        },
      })),
    z_GET_activeFilterCount: () =>
      get().z_myVocabDisplay_SETTINGS?.langFilters?.length +
      get().z_myVocabDisplay_SETTINGS?.difficultyFilters?.length,
  }));
