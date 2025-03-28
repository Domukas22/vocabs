//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import {
  InlineBtn_WRAP,
  Edit_BTN,
  ToggleMarked_BTN,
  ToggleDifficulties_BTN,
} from "../../../../1_parts";
import { memo } from "react";
import { z_USE_myOneVocab } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myOneVocab/z_USE_myOneVocab";

type Regular3Btn_WRAP_PROPS = {
  vocab: Vocab_TYPE;
  OPEN_updateVocabModal: () => void;
  TOGGLE_difficultyEdits: () => void;
};

export const Regular3Btn_WRAP = memo(
  ({
    vocab,
    OPEN_updateVocabModal = () => {},
    TOGGLE_difficultyEdits = () => {},
  }: Regular3Btn_WRAP_PROPS) => {
    const { z_SET_myOneVocab } = z_USE_myOneVocab();

    return (
      <InlineBtn_WRAP>
        <Edit_BTN
          onPress={() => {
            OPEN_updateVocabModal();
            z_SET_myOneVocab(vocab);
          }}
        />
        <ToggleMarked_BTN vocab={vocab} SHOULD_updateListUpdatedAt />
        <ToggleDifficulties_BTN
          vocab={vocab}
          onPress={TOGGLE_difficultyEdits}
        />
      </InlineBtn_WRAP>
    );
  }
);
