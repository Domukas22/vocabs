//
//
//

import { memo } from "react";
import { DifficultyEditBtn_WRAP, Regular3Btn_WRAP } from "./parts";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

type RegularTopBtn_WRAP_PROPS = {
  vocab: Vocab_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  SHOW_difficultyEdits: boolean;
  OPEN_updateVocabModal: () => void;
  TOGGLE_difficultyEdits: () => void;
};

export const RegularTopBtn_WRAP = memo(
  ({
    vocab,
    fetch_TYPE,
    SHOW_difficultyEdits = false,
    OPEN_updateVocabModal = () => {},
    TOGGLE_difficultyEdits = () => {},
  }: RegularTopBtn_WRAP_PROPS) => {
    if (SHOW_difficultyEdits) {
      return (
        <DifficultyEditBtn_WRAP
          TOGGLE_open={TOGGLE_difficultyEdits}
          vocab={vocab}
          SHOULD_updateListUpdatedAt={fetch_TYPE === "byTargetList"}
        />
      );
    } else {
      return (
        <Regular3Btn_WRAP
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
          vocab={vocab}
        />
      );
    }
  }
);
