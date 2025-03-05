//
//

import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import { USE_toggle } from "@/src/hooks";
import { View } from "react-native";
import React, { useMemo, memo } from "react";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { itemVisibility_TYPE } from "@/src/types/general_TYPES";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { DeleteIcon_BTN } from "./1_parts/DeleteIcon_BTN/DeleteIcon_BTN";
import { X_BTN } from "./1_parts/X_BTN/X_BTN";
import { Restore_BTN } from "./1_parts/Restore_BTN/Restore_BTN";
import { Copy_BTN } from "./1_parts/Copy_BTN/Copy_BTN";
import { ToggleDifficulties_BTN } from "./1_parts/ToggleDifficulties_BTN/ToggleDifficulties_BTN";
import { ToggleMarked_BTN } from "./1_parts/ToggleMarked_BTN/ToggleMarked_BTN";
import { Delete_BTN } from "./1_parts/Delete_BTN/Delete_BTN";
import { GoToMyOneList_BTN } from "./1_parts/GoToMyOneList_BTN/GoToMyOneList_BTN";
import { GoToPublicOneList_BTN } from "./1_parts/GoToPublicOneList_BTN/GoToPublicOneList_BTN";
import { Close_BTN } from "./1_parts/Close_BTN/Close_BTN";
import { Edit_BTN } from "./1_parts/Edit_BTN/Edit_BTN";
import { AllBtn_WRAP } from "./1_parts/AllBtn_WRAP/AllBtn_WRAP";
import { InlineBtn_WRAP } from "./1_parts/InlineBtn_WRAP/InlineBtn_WRAP";
import { DifficultyEditBtn_WRAP } from "./2_wraps/RegularTopBtn_WRAP/parts/DifficultyEditBtn_WRAP/DifficultyEditBtn_WRAP";
import { RegularTopBtn_WRAP } from "./2_wraps";

// 🔴🔴 TODO ==> finish MyListVocabCardBackBtn_WRAP

interface VocabBackBtns_PROPS {
  vocab: Vocab_TYPE;
  list_TYPE: itemVisibility_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_updateVocabModal: () => void;
  OPEN_vocabCopyModal: () => void;

  TOGGLE_open: () => void;
  GO_toListOfVocab: () => void;
}

const VocabBack_BTNS = React.memo(function VocabBack_BTNS({
  vocab,
  list_TYPE,
  fetch_TYPE,
  OPEN_updateVocabModal = () => {},
  TOGGLE_open = () => {},
}: VocabBackBtns_PROPS) {
  const { z_currentActions, IS_inAction } = z_USE_currentActions();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);
  const [SHOW_deleteConfirmation, TOGGLE_deleteConfirmation] =
    USE_toggle(false);

  const IS_deleting = useMemo(
    () => IS_inAction("vocab", vocab?.id, "deleting"),
    [z_currentActions]
  );

  const CloseBtn_WRAP = memo(
    ({ deleteType = "soft" }: { deleteType: "hard" | "soft" }) =>
      SHOW_deleteConfirmation ? (
        <View style={{ flexDirection: "row" }}>
          {!IS_deleting ? (
            <X_BTN onPress={() => TOGGLE_deleteConfirmation()} />
          ) : null}
          <Delete_BTN delete_TYPE={deleteType} vocab={vocab} />
        </View>
      ) : (
        <InlineBtn_WRAP>
          <DeleteIcon_BTN
            onPress={() => {
              TOGGLE_deleteConfirmation();
            }}
          />
          <Close_BTN onPress={TOGGLE_open} />
        </InlineBtn_WRAP>
      )
  );

  if (list_TYPE === "private") {
    if (fetch_TYPE === "byTargetList") {
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
    }
    if (fetch_TYPE === "all" || fetch_TYPE === "marked") {
      return (
        <AllBtn_WRAP>
          <RegularTopBtn_WRAP
            vocab={vocab}
            fetch_TYPE={fetch_TYPE}
            OPEN_updateVocabModal={OPEN_updateVocabModal}
            TOGGLE_difficultyEdits={TOGGLE_difficultyEdits}
            SHOW_difficultyEdits={SHOW_difficultyEdits}
          />

          <GoToMyOneList_BTN vocab={vocab} />
          <CloseBtn_WRAP deleteType="soft" />
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "deleted") {
      return (
        <AllBtn_WRAP>
          <Restore_BTN onPress={() => {}} />
          <CloseBtn_WRAP deleteType="hard" />
        </AllBtn_WRAP>
      );
    }
  }
  if (list_TYPE === "public") {
    if (fetch_TYPE === "byTargetList") {
      return (
        <AllBtn_WRAP>
          <Copy_BTN onPress={() => {}} />
          <Close_BTN onPress={TOGGLE_open} />
        </AllBtn_WRAP>
      );
    }
    if (fetch_TYPE === "all") {
      return (
        <AllBtn_WRAP>
          <Copy_BTN onPress={() => {}} />
          <GoToPublicOneList_BTN vocab={vocab} />
          <Close_BTN onPress={TOGGLE_open} />
        </AllBtn_WRAP>
      );
    }
  }

  return null;
});

export default VocabBack_BTNS;
