//
//
//

import React, { memo } from "react";
import { AllBtn_WRAP } from "../../1_parts";
import { RegularTopBtn_WRAP } from "../../2_wraps";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";

// 🔴🔴 TODO ==> finish MyListVocabCardBackBtn_WRAP

type Props = {
  vocab: Vocab_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_updateVocabModal: () => void;
  TOGGLE_difficultyEdits: () => void;
  SHOW_difficultyEdits: () => void;
};

export const MyListVocabCardBackBtn_WRAP = memo(({ vocab }: Props) => {
  return (
    <AllBtn_WRAP>
      <RegularTopBtn_WRAP
        vocab={vocab}
        fetch_TYPE={fetch_TYPE}
        OPEN_updateVocabModal={OPEN_updateVocabModal}
        TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
        SHOW_difficultyEdits={SHOW_difficultyEdits}
      />
      <CloseBtn_WRAP deleteType="soft" />
    </AllBtn_WRAP>
  );
});
