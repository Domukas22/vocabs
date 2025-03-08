//
//
//

import React, { memo } from "react";
import {
  AllBtn_WRAP,
  Close_BTN,
  Copy_BTN,
  GoToPublicOneList_BTN,
} from "../../1_parts";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

type Props = {
  vocab: Vocab_TYPE;
  COPY_vocab: () => void;
  TOGGLE_vocabCard: () => void;
};

export const PublicVocabCardBackBtn_WRAP = memo(
  ({ vocab, COPY_vocab = () => {}, TOGGLE_vocabCard = () => {} }: Props) => {
    return (
      <AllBtn_WRAP>
        <Copy_BTN onPress={COPY_vocab} />
        <GoToPublicOneList_BTN vocab={vocab} />
        <Close_BTN onPress={TOGGLE_vocabCard} />
      </AllBtn_WRAP>
    );
  }
);
