//
//
//

import { create } from "zustand";
import { User_TYPE } from "../../types";

interface z_USE_user_PROPS {
  z_user: User_TYPE | undefined;
  z_SET_user: (new_SETTINGS: Partial<User_TYPE | undefined>) => void;
}

export const z_USE_user = create<z_USE_user_PROPS>((set) => ({
  z_user: undefined,

  z_SET_user: (new_SETTINGS) => {
    set((state) => ({
      z_user: {
        ...((state.z_user || {}) as User_TYPE), // Ensure we merge into a User_TYPE object
        ...new_SETTINGS,
      },
    }));
  },
}));
