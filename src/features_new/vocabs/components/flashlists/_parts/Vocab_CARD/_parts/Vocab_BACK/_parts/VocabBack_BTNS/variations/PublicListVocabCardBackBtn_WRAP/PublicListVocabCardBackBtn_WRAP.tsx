//
//
//

import React, { memo } from "react";
import { AllBtn_WRAP, Close_BTN, Copy_BTN } from "../../1_parts";

type Props = {
  TOGGLE_vocabCard: () => void;
  COPY_vocab: () => void;
};

export const PublicListVocabCardBackBtn_WRAP = memo(
  ({ TOGGLE_vocabCard = () => {}, COPY_vocab = () => {} }: Props) => {
    return (
      <AllBtn_WRAP>
        <Copy_BTN onPress={COPY_vocab} />
        <Close_BTN onPress={TOGGLE_vocabCard} />
      </AllBtn_WRAP>
    );
  }
);
