//
//

import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { USE_toggle } from "@/src/hooks";
import React from "react";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import {
  MyAllVocabCardBackBtn_WRAP,
  MyDeletedCardBackBtn_WRAP,
  MyListVocabCardBackBtn_WRAP,
  MyMarkedVocabCardBackBtn_WRAP,
  PublicListVocabCardBackBtn_WRAP,
  PublicVocabCardBackBtn_WRAP,
} from "./variations";
import { USE_vocabCardStates } from "./hooks";

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: privateOrPublic_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_updateVocabModal: () => void;
  OPEN_vocabCopyModal: () => void;
  TOGGLE_vocabCard: () => void;
}

export const VocabBack_BTNS = React.memo(function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,
  OPEN_updateVocabModal = () => {},
  TOGGLE_vocabCard = () => {},
  OPEN_vocabCopyModal = () => {},
}: VocabBackBtns_PROPS) {
  const {
    SHOULD_showDeleteConfirmation,
    SHOULD_showDifficultyEdits,
    TOGGLE_deleteConfirmation,
    TOGGLE_difficultyEdits,
  } = USE_vocabCardStates();

  if (list_TYPE === "private") {
    switch (fetch_TYPE) {
      case "all":
        return (
          <MyAllVocabCardBackBtn_WRAP
            vocab={vocab}
            SHOULD_showDeleteConfirmation={SHOULD_showDeleteConfirmation}
            SHOULD_showDifficultyEdits={SHOULD_showDifficultyEdits}
            OPEN_updateVocabModal={OPEN_updateVocabModal}
            TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
            TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
            TOGGLE_vocabCard={TOGGLE_vocabCard}
          />
        );
      case "byTargetList":
        return (
          <MyListVocabCardBackBtn_WRAP
            vocab={vocab}
            SHOULD_showDeleteConfirmation={SHOULD_showDeleteConfirmation}
            SHOULD_showDifficultyEdits={SHOULD_showDifficultyEdits}
            OPEN_updateVocabModal={OPEN_updateVocabModal}
            TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
            TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
            TOGGLE_vocabCard={TOGGLE_vocabCard}
          />
        );
      case "marked":
        return (
          <MyMarkedVocabCardBackBtn_WRAP
            vocab={vocab}
            SHOULD_showDeleteConfirmation={SHOULD_showDeleteConfirmation}
            SHOULD_showDifficultyEdits={SHOULD_showDifficultyEdits}
            OPEN_updateVocabModal={OPEN_updateVocabModal}
            TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
            TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
            TOGGLE_vocabCard={TOGGLE_vocabCard}
          />
        );

      case "deleted":
        return (
          <MyDeletedCardBackBtn_WRAP
            vocab={vocab}
            SHOULD_showDeleteConfirmation={SHOULD_showDeleteConfirmation}
            TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
            TOGGLE_vocabCard={TOGGLE_vocabCard}
          />
        );
    }
  }
  if (list_TYPE === "public") {
    switch (fetch_TYPE) {
      case "byTargetList":
        return (
          <PublicListVocabCardBackBtn_WRAP
            TOGGLE_vocabCard={TOGGLE_vocabCard}
            OPEN_vocabCopyModal={OPEN_vocabCopyModal}
            vocab={vocab}
          />
        );
      case "all":
        return (
          <PublicVocabCardBackBtn_WRAP
            vocab={vocab}
            OPEN_vocabCopyModal={OPEN_vocabCopyModal}
            TOGGLE_vocabCard={TOGGLE_vocabCard}
          />
        );
    }
  }

  return null;
});
