//
//
//

import { MarkedVocabFilter_PROPS } from "@/src/features_new/vocabs/types";
import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";
import {
  GET_activeFilterCount,
  SET_sorting,
  SET_sortDirection,
  TOGGLE_showDescription,
  TOGGLE_showFlags,
  TOGGLE_showDifficulty,
  SET_frontLangId,
  HANDLE_langFilter,
  HANDLE_difficultyFilter,
} from "../_helpers";

export type markedVocabsSorting_TYPE = "difficulty" | "date";

interface z_USE_markedVocabsSettings_PROPS {
  sorting: {
    type: markedVocabsSorting_TYPE;
    direction: sortDirection_TYPE;
  };
  filters: MarkedVocabFilter_PROPS;
  appearance: {
    frontTrLang_ID: string;
    SHOW_description: boolean;
    SHOW_flags: boolean;
    SHOW_difficulty: boolean;
  };

  z_HANDLE_langFilter: (toRemoveLang_ID: string) => void;
  z_HANDLE_difficultyFilter: (toRemove_DIFFICULTY: 1 | 2 | 3) => void;

  z_GET_activeFilterCount: () => number;

  z_SET_sorting: (sorting_TYPE: markedVocabsSorting_TYPE) => void;
  z_SET_sortDirection: (sortDirection_TYPE: sortDirection_TYPE) => void;

  z_TOGGLE_showDescription: () => void;
  z_TOGGLE_showFlags: () => void;
  z_TOGGLE_showDifficulty: () => void;

  z_SET_frontLangId: (newLang_ID: string) => void;
  z_CLEAR_filters: () => void;
}

export const z_USE_markedVocabsSettings =
  create<z_USE_markedVocabsSettings_PROPS>((set, get) => ({
    sorting: {
      type: "date",
      direction: "descending",
    },

    filters: {
      difficulties: [],
      langs: [],
    },
    appearance: {
      frontTrLang_ID: "en",
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
    },

    z_CLEAR_filters: () => set({ filters: { difficulties: [], langs: [] } }),
    z_GET_activeFilterCount: () => GET_activeFilterCount(get()),

    z_SET_sorting: (sorting_TYPE) => set(SET_sorting(sorting_TYPE)),
    z_SET_sortDirection: (sortDirection_TYPE) =>
      set(SET_sortDirection(sortDirection_TYPE)),

    z_TOGGLE_showDescription: () => set(TOGGLE_showDescription()),
    z_TOGGLE_showFlags: () => set(TOGGLE_showFlags()),
    z_TOGGLE_showDifficulty: () => set(TOGGLE_showDifficulty()),

    z_SET_frontLangId: (newLang_ID) => set(SET_frontLangId(newLang_ID)),

    z_HANDLE_langFilter: (targetLang_ID) =>
      set(HANDLE_langFilter(targetLang_ID)),
    z_HANDLE_difficultyFilter: (diff) => set(HANDLE_difficultyFilter(diff)),
  }));
