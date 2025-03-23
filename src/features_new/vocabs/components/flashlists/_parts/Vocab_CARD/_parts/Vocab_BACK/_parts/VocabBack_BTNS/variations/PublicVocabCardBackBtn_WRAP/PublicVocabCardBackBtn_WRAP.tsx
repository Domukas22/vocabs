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
import { z_USE_publicOneVocab } from "@/src/features_new/vocabs/hooks/zustand/z_USE_publicOneVocab/z_USE_publicOneVocab";

type Props = {
  vocab: Vocab_TYPE;
  OPEN_vocabCopyModal: () => void;
  TOGGLE_vocabCard: () => void;
};

export const PublicVocabCardBackBtn_WRAP = memo(
  ({
    vocab,
    OPEN_vocabCopyModal = () => {},
    TOGGLE_vocabCard = () => {},
  }: Props) => {
    const { z_SET_publicOneVocab } = z_USE_publicOneVocab();

    return (
      <AllBtn_WRAP>
        <Copy_BTN
          onPress={() => {
            OPEN_vocabCopyModal();
            z_SET_publicOneVocab(vocab);
          }}
        />
        <GoToPublicOneList_BTN vocab={vocab} />
        <Close_BTN onPress={TOGGLE_vocabCard} />
      </AllBtn_WRAP>
    );
  }
);
