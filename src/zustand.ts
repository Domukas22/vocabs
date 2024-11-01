//
//
//

// zustand_store.js
import { create } from "zustand";
import { Vocab_MODEL, List_MODEL, User_MODEL } from "./db/watermelon_MODELS";

export type z_listDisplaySettings_PROPS = {
  sorting: "date";
  sortDirection: "ascending" | "descending";
  langFilters: string[];
};
export type z_vocabDisplaySettings_PROPS = {
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "difficulty" | "date" | "shuffle"; // Example sorting options
  sortDirection: "ascending" | "descending";
  difficultyFilters: (1 | 2 | 3)[]; // Assuming the difficulty filters are represented by numbers
  langFilters: string[]; // Assuming language filters are represented by language codes or IDs as strings
};

export type z_setlistDisplaySettings_PROPS = (
  newSettings: Partial<z_listDisplaySettings_PROPS>
) => void;

export type z_setVocabDisplaySettings_PROPS = (
  newSettings: Partial<z_vocabDisplaySettings_PROPS>
) => void;

export type z_setUser_PROPS = (newUser_CONTENT: User_MODEL | undefined) => void;

interface ZustandStore {
  z_vocabDisplay_SETTINGS: z_vocabDisplaySettings_PROPS;
  z_SET_vocabDisplaySettings: z_setVocabDisplaySettings_PROPS;

  z_listDisplay_SETTINGS: z_listDisplaySettings_PROPS;
  z_SET_listDisplaySettings: z_setlistDisplaySettings_PROPS;

  z_user: User_MODEL | undefined;
  z_SET_user: z_setUser_PROPS;
}

const USE_zustand = create<ZustandStore>((set) => ({
  z_user: undefined,

  z_SET_user: (newUser_CONTENT) => {
    set(() => ({
      z_user: newUser_CONTENT,
    }));
  },

  z_listDisplay_SETTINGS: {
    sorting: "date",
    sortDirection: "ascending",
    langFilters: [],
  },
  z_vocabDisplay_SETTINGS: {
    SHOW_description: true,
    SHOW_flags: true,
    SHOW_difficulty: true,
    frontTrLang_ID: "en",
    sorting: "difficulty",
    sortDirection: "ascending",
    difficultyFilters: [],
    langFilters: [],
  },

  z_SET_listDisplaySettings: (newSettings) => {
    set((state) => ({
      z_listDisplay_SETTINGS: {
        ...state.z_listDisplay_SETTINGS,
        ...newSettings,
      },
    }));
  },
  z_SET_vocabDisplaySettings: (newSettings) => {
    set((state) => ({
      z_vocabDisplay_SETTINGS: {
        ...state.z_vocabDisplay_SETTINGS,
        ...newSettings,
      },
    }));
  },
}));

export default USE_zustand;
