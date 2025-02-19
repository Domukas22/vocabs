//
//
//

import { create } from "zustand";
import { Vocab_TYPE } from "../../../types";

type z_USE_myOneVocab_PROPS = {
  z_myOneVocab: Vocab_TYPE | undefined;
  z_SET_myOneVocab: (list: Vocab_TYPE) => void;
  z_RESET_myOneVocab: () => void;
};

export const z_USE_myOneVocab = create<z_USE_myOneVocab_PROPS>((set) => ({
  z_myOneVocab: undefined,
  z_SET_myOneVocab: (vocab: Vocab_TYPE) => set({ z_myOneVocab: vocab }),
  z_RESET_myOneVocab: () => set({ z_myOneVocab: undefined }),
}));
