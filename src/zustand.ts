//
//
//

// zustand_store.js
import { create } from "zustand";
import { Vocab_MODEL, List_MODEL } from "./db/watermelon_MODELS";

export type DisplaySettings_PROPS = {
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "difficulty" | "date" | "shuffle"; // Example sorting options
  sortDirection: "ascending" | "descending";
  difficultyFilters: (1 | 2 | 3)[]; // Assuming the difficulty filters are represented by numbers
  langFilters: string[]; // Assuming language filters are represented by language codes or IDs as strings
};

export type SetDisplaySettings_PROPS = (
  newSettings: Partial<DisplaySettings_PROPS>
) => void;

interface ZustandStore {
  z_display_SETTINGS: DisplaySettings_PROPS;
  z_SET_displaySettings: SetDisplaySettings_PROPS;
}

const USE_zustand = create<ZustandStore>((set) => ({
  z_display_SETTINGS: {
    SHOW_description: true,
    SHOW_flags: true,
    SHOW_difficulty: true,
    frontTrLang_ID: "en",
    sorting: "difficulty",
    sortDirection: "ascending",
    difficultyFilters: [],
    langFilters: [],
  },
  z_SET_displaySettings: (newSettings) => {
    set((state) => ({
      z_display_SETTINGS: {
        ...state.z_display_SETTINGS,
        ...newSettings,
      },
    }));
  },
}));

export default USE_zustand;
