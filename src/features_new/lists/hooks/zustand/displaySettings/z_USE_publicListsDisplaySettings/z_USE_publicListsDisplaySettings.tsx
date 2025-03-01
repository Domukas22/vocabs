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

interface z_USE_publicListsDisplaySettings_PROPS {
  z_publicListDisplay_SETTINGS: z_publicListsDisplaySettings_PROPS;
  z_SET_publicListDisplaySettings: (
    new_SETTINGS: Partial<z_publicListsDisplaySettings_PROPS>
  ) => void;
  z_HANDLE_langFilter: (targetLang_ID: string) => void;
  z_GET_activeFilterCount: () => number;

  z_SET_sorting: (sorting_TYPE: publicListsSorting_TYPE) => void;
  z_SET_sortDirection: (sortDirection_TYPE: sortDirection_TYPE) => void;
}

export const z_USE_publicListsDisplaySettings =
  create<z_USE_publicListsDisplaySettings_PROPS>((set, get) => ({
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
    z_HANDLE_langFilter: (targetLang_ID) =>
      set((state) => ({
        z_publicListDisplay_SETTINGS: {
          ...state.z_publicListDisplay_SETTINGS,
          langFilters: state.z_publicListDisplay_SETTINGS.langFilters?.some(
            (lang) => lang === targetLang_ID
          )
            ? state.z_publicListDisplay_SETTINGS.langFilters.filter(
                (lang_id) => lang_id !== targetLang_ID
              )
            : [
                ...state.z_publicListDisplay_SETTINGS.langFilters,
                targetLang_ID,
              ],
        },
      })),
    z_GET_activeFilterCount: () =>
      get().z_publicListDisplay_SETTINGS?.langFilters?.length,

    z_SET_sorting: (sorting_TYPE) =>
      set((state) => ({
        z_publicListDisplay_SETTINGS: {
          ...state.z_publicListDisplay_SETTINGS,
          sorting: sorting_TYPE,
        },
      })),

    z_SET_sortDirection: (sortDirection_TYPE) =>
      set((state) => ({
        z_publicListDisplay_SETTINGS: {
          ...state.z_publicListDisplay_SETTINGS,
          sortDirection: sortDirection_TYPE,
        },
      })),
  }));
