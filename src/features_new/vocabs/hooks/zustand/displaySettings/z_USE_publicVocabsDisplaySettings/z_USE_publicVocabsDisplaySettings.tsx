//
//
//

import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type publicVocabsSorting_TYPE = "date" | "saved-count";

export type z_publicVocabsDisplaySettings_PROPS = {
  frontTrLang_ID: string;

  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;

  sorting: publicVocabsSorting_TYPE;
  sortDirection: sortDirection_TYPE;

  langFilters: string[];
};

interface z_USE_publicVocabsDisplaySettings_PROPS {
  z_publicVocabDisplay_SETTINGS: z_publicVocabsDisplaySettings_PROPS;
  z_SET_publicVocabDisplaySettings: (
    new_SETTINGS: Partial<z_publicVocabsDisplaySettings_PROPS>
  ) => void;
  z_REMOVE_langFilter: (toRemoveLang_ID: string) => void;
  z_GET_activeFilterCount: () => void;
}

export const z_USE_publicVocabsDisplaySettings =
  create<z_USE_publicVocabsDisplaySettings_PROPS>((set, get) => ({
    z_publicVocabDisplay_SETTINGS: {
      frontTrLang_ID: "en",

      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,

      sorting: "date",
      sortDirection: "descending",

      langFilters: [],
    },

    z_SET_publicVocabDisplaySettings: (new_SETTINGS) => {
      set((state) => ({
        z_publicVocabDisplay_SETTINGS: {
          ...state.z_publicVocabDisplay_SETTINGS,
          ...new_SETTINGS,
        },
      }));
    },
    z_REMOVE_langFilter: (toRemoveLang_ID) =>
      set((state) => ({
        z_publicVocabDisplay_SETTINGS: {
          ...state.z_publicVocabDisplay_SETTINGS,
          langFilters: state.z_publicVocabDisplay_SETTINGS.langFilters.filter(
            (lang_id) => lang_id !== toRemoveLang_ID
          ),
        },
      })),

    z_GET_activeFilterCount: () =>
      get().z_publicVocabDisplay_SETTINGS?.langFilters?.length,
  }));
