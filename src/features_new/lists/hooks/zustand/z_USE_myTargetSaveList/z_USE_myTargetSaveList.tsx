//
//
//

import { create } from "zustand";
import { List_TYPE } from "@/src/features_new/lists/types";

type z_USE_myTargetSaveList_PROPS = {
  z_myTargetSave_LIST: List_TYPE | undefined;
  z_SET_myTargetSaveList: (list: List_TYPE) => void;
  z_RESET_myTargetSaveList: () => void;
};

export const z_USE_myTargetSaveList = create<z_USE_myTargetSaveList_PROPS>(
  (set, get) => ({
    z_myTargetSave_LIST: undefined,
    z_SET_myTargetSaveList: (list: List_TYPE) =>
      set({ z_myTargetSave_LIST: list }),
    z_RESET_myTargetSaveList: () => set({ z_myTargetSave_LIST: undefined }),
  })
);
