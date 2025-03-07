//
//
//

import React, { memo } from "react";
import { AllBtn_WRAP, Restore_BTN } from "../../1_parts";
import { RegularTopBtn_WRAP } from "../../2_wraps";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { CloseBtn_WRAP } from "../../2_wraps/CloseBtn_WRAP/CloseBtn_WRAP";

type Props = {
  vocab: Vocab_TYPE;
  SHOULD_showDeleteConfirmation: boolean;
  TOGGLE_deleteConfirmation: () => void;
  TOGGLE_vocabCard: () => void;
};

export const MyDeletedCardBackBtn_WRAP = memo(
  ({
    vocab,
    SHOULD_showDeleteConfirmation = false,
    TOGGLE_deleteConfirmation = () => {},
    TOGGLE_vocabCard = () => {},
  }: Props) => {
    return (
      <AllBtn_WRAP>
        <Restore_BTN onPress={() => {}} />
        <CloseBtn_WRAP
          SHOW_deleteConfirmation={SHOULD_showDeleteConfirmation}
          TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
          delete_TYPE="hard"
          vocab={vocab}
        />
      </AllBtn_WRAP>
    );
  }
);
