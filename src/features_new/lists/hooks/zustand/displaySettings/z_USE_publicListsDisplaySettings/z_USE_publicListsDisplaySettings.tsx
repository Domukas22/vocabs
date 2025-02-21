//
//
//

import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type publicListsSorting_TYPE = "date" | "vocab-count" | "saved-count";

export type z_publicListsDisplaySettings_PROPS = {
  sorting: publicListsSorting_TYPE;
  sortDirection: sortDirection_TYPE;
  langFilters: string[];
};

interface z_USE_publicListDisplaySettings_PROPS {
  z_publicListDisplay_SETTINGS: z_publicListsDisplaySettings_PROPS;
  z_SET_publicListDisplaySettings: (
    new_SETTINGS: Partial<z_publicListsDisplaySettings_PROPS>
  ) => void;
}

export const z_USE_publicListsDisplaySettings =
  create<z_USE_publicListDisplaySettings_PROPS>((set) => ({
    z_publicListDisplay_SETTINGS: {
      sorting: "date",
      sortDirection: "descending",
      langFilters: [],
    },

    z_SET_publicListDisplaySettings: (new_SETTINGS) => {
      set((state) => ({
        z_publicListDisplay_SETTINGS: {
          ...state.z_publicListDisplay_SETTINGS,
          ...new_SETTINGS,
        },
      }));
    },
  }));
