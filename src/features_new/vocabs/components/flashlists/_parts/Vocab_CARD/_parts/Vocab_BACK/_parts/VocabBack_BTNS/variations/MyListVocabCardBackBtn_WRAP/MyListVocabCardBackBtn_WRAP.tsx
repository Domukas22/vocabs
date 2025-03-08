//
//
//

import React, { memo } from "react";
import { AllBtn_WRAP } from "../../1_parts";
import { RegularTopBtn_WRAP } from "../../2_wraps";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { CloseBtn_WRAP } from "../../2_wraps/CloseBtn_WRAP/CloseBtn_WRAP";

type Props = {
  vocab: Vocab_TYPE;
  SHOULD_showDeleteConfirmation: boolean;
  SHOULD_showDifficultyEdits: boolean;
  OPEN_updateVocabModal: () => void;
  TOGGLE_difficultyEdits: () => void;
  TOGGLE_deleteConfirmation: () => void;
  TOGGLE_vocabCard: () => void;
};

export const MyListVocabCardBackBtn_WRAP = memo(
  ({
    vocab,
    SHOULD_showDeleteConfirmation = false,
    SHOULD_showDifficultyEdits = false,
    OPEN_updateVocabModal = () => {},
    TOGGLE_difficultyEdits = () => {},
    TOGGLE_deleteConfirmation = () => {},
    TOGGLE_vocabCard = () => {},
  }: Props) => {
    return (
      <AllBtn_WRAP>
        <RegularTopBtn_WRAP
          vocab={vocab}
          fetch_TYPE="byTargetList"
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
          SHOW_difficultyEdits={SHOULD_showDifficultyEdits}
        />
        <CloseBtn_WRAP
          SHOW_deleteConfirmation={SHOULD_showDeleteConfirmation}
          TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
          delete_TYPE="soft"
          vocab={vocab}
        />
      </AllBtn_WRAP>
    );
  }
);
