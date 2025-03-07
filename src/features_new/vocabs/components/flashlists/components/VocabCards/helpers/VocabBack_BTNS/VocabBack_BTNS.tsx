//
//

import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { USE_toggle } from "@/src/hooks";
import React from "react";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { Copy_BTN } from "./1_parts/Copy_BTN/Copy_BTN";
import { GoToMyOneList_BTN } from "./1_parts/GoToMyOneList_BTN/GoToMyOneList_BTN";
import { GoToPublicOneList_BTN } from "./1_parts/GoToPublicOneList_BTN/GoToPublicOneList_BTN";
import { Close_BTN } from "./1_parts/Close_BTN/Close_BTN";
import { AllBtn_WRAP } from "./1_parts/AllBtn_WRAP/AllBtn_WRAP";
import { RegularTopBtn_WRAP } from "./2_wraps";
import { CloseBtn_WRAP } from "./2_wraps/CloseBtn_WRAP/CloseBtn_WRAP";
import {
  MyAllVocabCardBackBtn_WRAP,
  MyDeletedCardBackBtn_WRAP,
  MyListVocabCardBackBtn_WRAP,
  MyMarkedVocabCardBackBtn_WRAP,
  PublicListVocabCardBackBtn_WRAP,
  PublicVocabCardBackBtn_WRAP,
} from "./variations";

// 🔴🔴 TODO ==> finish MyListVocabCardBackBtn_WRAP

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: itemVisibility_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_updateVocabModal: () => void;
  OPEN_vocabCopyModal: () => void;

  TOGGLE_vocabCard: () => void;
  GO_toListOfVocab: () => void;
}

const VocabBack_BTNS = React.memo(function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,
  OPEN_updateVocabModal = () => {},
  TOGGLE_vocabCard = () => {},
}: VocabBackBtns_PROPS) {
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);
  const [SHOW_deleteConfirmation, TOGGLE_deleteConfirmation] =
    USE_toggle(false);

  if (list_TYPE === "private") {
    if (fetch_TYPE === "byTargetList") {
      return (
        <MyListVocabCardBackBtn_WRAP
          vocab={vocab}
          SHOULD_showDeleteConfirmation={SHOW_deleteConfirmation}
          SHOULD_showDifficultyEdits={SHOW_difficultyEdits}
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
          TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
        />
      );
    }
    if (fetch_TYPE === "all") {
      return (
        <MyAllVocabCardBackBtn_WRAP
          vocab={vocab}
          SHOULD_showDeleteConfirmation={SHOW_deleteConfirmation}
          SHOULD_showDifficultyEdits={SHOW_difficultyEdits}
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
          TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
        />
      );
    }
    if (fetch_TYPE === "marked") {
      return (
        <MyMarkedVocabCardBackBtn_WRAP
          vocab={vocab}
          SHOULD_showDeleteConfirmation={SHOW_deleteConfirmation}
          SHOULD_showDifficultyEdits={SHOW_difficultyEdits}
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
          TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
        />
      );
    }

    if (fetch_TYPE === "deleted") {
      return (
        <MyDeletedCardBackBtn_WRAP
          vocab={vocab}
          SHOULD_showDeleteConfirmation={SHOW_deleteConfirmation}
          TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
        />
      );
    }
  }
  if (list_TYPE === "public") {
    if (fetch_TYPE === "byTargetList") {
      return (
        <PublicListVocabCardBackBtn_WRAP
          TOGGLE_vocabCard={TOGGLE_vocabCard}
          COPY_vocab={() => {}}
        />
      );
    }
    if (fetch_TYPE === "all") {
      return (
        <PublicVocabCardBackBtn_WRAP
          vocab={vocab}
          COPY_vocab={() => {}}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
        />
      );
    }
  }

  return null;
});

export default VocabBack_BTNS;
