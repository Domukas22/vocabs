//
//
//

import { sortDirection_TYPE } from "@/src/types/general_TYPES";
import { create } from "zustand";

export type myListsSorting_TYPE = "date" | "vocab-count";

export type z_myListsDisplaySettings_PROPS = {
  sorting: myListsSorting_TYPE;
  sortDirection: sortDirection_TYPE;
  langFilters: string[];
};

interface z_USE_myListsDisplaySettings_PROPS {
  z_myListDisplay_SETTINGS: z_myListsDisplaySettings_PROPS;
  z_SET_myListDisplaySettings: (
    new_SETTINGS: Partial<z_myListsDisplaySettings_PROPS>
  ) => void;

  z_REMOVE_langFilter: (toRemoveLang_ID: string) => void;
  z_GET_activeFilterCount: () => void;
}

export const z_USE_myListsDisplaySettings =
  create<z_USE_myListsDisplaySettings_PROPS>((set, get) => ({
    z_myListDisplay_SETTINGS: {
      sorting: "date",
      sortDirection: "descending",
      langFilters: [],
    },

    z_SET_myListDisplaySettings: (new_SETTINGS) => {
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          ...new_SETTINGS,
        },
      }));
    },
    z_REMOVE_langFilter: (toRemoveLang_ID) =>
      set((state) => ({
        z_myListDisplay_SETTINGS: {
          ...state.z_myListDisplay_SETTINGS,
          langFilters: state.z_myListDisplay_SETTINGS.langFilters.filter(
            (lang_id) => lang_id !== toRemoveLang_ID
          ),
        },
      })),
    z_GET_activeFilterCount: () =>
      get().z_myListDisplay_SETTINGS?.langFilters?.length,
  }));
