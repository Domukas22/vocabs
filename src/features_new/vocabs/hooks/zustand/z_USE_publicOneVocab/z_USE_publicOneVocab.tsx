//
//
//

import { create } from "zustand";
import { Vocab_TYPE } from "../../../types";

type z_USE_publicOneVocab_PROPS = {
  z_publicOneVocab: Vocab_TYPE | undefined;
  z_SET_publicOneVocab: (list: Vocab_TYPE) => void;
  z_RESET_publicOneVocab: () => void;
};

export const z_USE_publicOneVocab = create<z_USE_publicOneVocab_PROPS>(
  (set) => ({
    z_publicOneVocab: undefined,
    z_SET_publicOneVocab: (vocab: Vocab_TYPE) =>
      set({ z_publicOneVocab: vocab }),
    z_RESET_publicOneVocab: () => set({ z_publicOneVocab: undefined }),
  })
);
