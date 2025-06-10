//
//
//

import { FlashcardsFilter_PROPS } from "@/src/features_new/vocabs/types";
import { create } from "zustand";
import {
  GET_activeFilterCount,
  HANDLE_markedFilter,
  TOGGLE_showDescription,
  TOGGLE_showFlags,
  TOGGLE_showDifficulty,
  SET_frontLangId,
  HANDLE_langFilter,
  HANDLE_difficultyFilter,
} from "../_helpers";

interface z_USE_flashcardsDisplaySettings_PROPS {
  filters: FlashcardsFilter_PROPS;
  appearance: {
    frontTrLang_ID: string;
    SHOW_description: boolean;
  };

  z_HANDLE_langFilter: (toRemoveLang_ID: string) => void;
  z_HANDLE_difficultyFilter: (toRemove_DIFFICULTY: 1 | 2 | 3) => void;
  z_HANDLE_markedFilter: () => void;

  z_GET_activeFilterCount: () => number;

  z_TOGGLE_showDescription: () => void;
  z_TOGGLE_showFlags: () => void;
  z_TOGGLE_showDifficulty: () => void;

  z_SET_frontLangId: (newLang_ID: string) => void;
  z_CLEAR_filters: () => void;
}

//flashcard filters require at least 2 lan
export const z_USE_flashcardsDisplaySettings =
  create<z_USE_flashcardsDisplaySettings_PROPS>((set, get) => ({
    filters: {
      byMarked: false,
      difficulties: [],
      langs: [],
      byList: "",
    },
    appearance: {
      frontTrLang_ID: "en",
      SHOW_description: true,
    },

    z_CLEAR_filters: () =>
      set({ filters: { byMarked: false, difficulties: [], langs: [] } }),

    z_GET_activeFilterCount: () => GET_activeFilterCount(get()),

    z_HANDLE_markedFilter: () => set(HANDLE_markedFilter()),
    z_TOGGLE_showDescription: () => set(TOGGLE_showDescription()),
    z_TOGGLE_showFlags: () => set(TOGGLE_showFlags()),
    z_TOGGLE_showDifficulty: () => set(TOGGLE_showDifficulty()),

    z_SET_frontLangId: (newLang_ID) => set(SET_frontLangId(newLang_ID)),

    z_HANDLE_langFilter: (targetLang_ID) =>
      set(HANDLE_langFilter(targetLang_ID)),

    z_HANDLE_difficultyFilter: (diff) => set(HANDLE_difficultyFilter(diff)),
  }));
