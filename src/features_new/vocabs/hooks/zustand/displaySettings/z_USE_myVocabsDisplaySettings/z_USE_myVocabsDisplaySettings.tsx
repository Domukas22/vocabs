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
}

export const z_USE_myVocabsDisplaySettings =
  create<z_USE_myVocabsDisplaySettings_PROPS>((set) => ({
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
  }));
