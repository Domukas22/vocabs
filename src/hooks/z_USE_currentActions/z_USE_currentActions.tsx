//
//
//

//
//
//

import { create } from "zustand";
import { z_USE_currentActions_PROPS, currentAction_TYPE } from "./types";

export const z_USE_currentActions = create<z_USE_currentActions_PROPS>(
  (set, get) => ({
    z_currentActions: [],
    ADD_currentAction: (item_TYPE, item_ID, item_ACTION) =>
      set((state) => ({
        z_currentActions: [
          ...state.z_currentActions,
          { item_TYPE, item_ID, item_ACTION } as currentAction_TYPE,
        ],
      })),

    REMOVE_currentAction: (item_ID) =>
      set((state) => ({
        z_currentActions: [...state.z_currentActions].filter(
          (x) => x.item_ID !== item_ID
        ),
      })),

    IS_inAction: (item_TYPE, item_ID) =>
      get().z_currentActions.some(
        (action) => action.item_TYPE === item_TYPE && action.item_ID === item_ID
      ),
  })
);
