//
//
//

import { StyleSheet, View } from "react-native";
import React, { useEffect, useMemo } from "react";

import { MyColors } from "@/src/constants/MyColors";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";
import { Vocab_FRONT, Vocab_BACK } from "./_parts";

interface VocabProps {
  vocab: Vocab_TYPE;
  list_TYPE: privateOrPublic_TYPE;
  fetch_TYPE: vocabFetch_TYPES;
  highlighted?: boolean;
  OPEN_updateVocabModal?: () => void;
  OPEN_vocabCopyModal?: () => void;
  IS_vocabSelectionOn?: boolean;
  HANDLE_vocabSelection: (id: string, vocab: Vocab_TYPE) => void;
  selected_VOCABS: Map<string, Vocab_TYPE>;
}

export const Vocab_CARD = React.memo(function MyVocab_CARD({
  vocab,
  list_TYPE,
  fetch_TYPE,
  highlighted = false,
  IS_vocabSelectionOn = false,
  OPEN_updateVocabModal = () => {},
  OPEN_vocabCopyModal = () => {},
  HANDLE_vocabSelection = () => {},
  selected_VOCABS = new Map(),
}: VocabProps) {
  const [open, TOGGLE_vocabCard] = USE_toggle();

  useEffect(() => {
    if (open && IS_vocabSelectionOn) TOGGLE_vocabCard();
  }, [IS_vocabSelectionOn]);

  const IS_selected = useMemo(
    () => selected_VOCABS.has(vocab.id),
    [vocab.id, selected_VOCABS]
  );

  const styles = useMemo(
    () => [
      s._vocab,
      open && s.vocab_open,
      IS_vocabSelectionOn && s._vocab_selectable,
      IS_vocabSelectionOn && IS_selected && s._vocab_selectable_selected,
      open && s[`difficulty_${vocab?.difficulty || 0}`],
      highlighted && s.highlighted,
    ],
    [open, vocab?.difficulty, highlighted, IS_vocabSelectionOn, IS_selected]
  );

  return (
    <View style={styles}>
      {!open ? (
        <Vocab_FRONT
          vocab={vocab}
          highlighted={highlighted}
          TOGGLE_open={() => {
            if (IS_vocabSelectionOn) {
              HANDLE_vocabSelection(vocab.id, vocab);
            } else {
              TOGGLE_vocabCard();
            }
          }}
          IS_vocabSelectionOn={IS_vocabSelectionOn}
          IS_selected={IS_selected}
        />
      ) : (
        <Vocab_BACK
          vocab={vocab}
          fetch_TYPE={fetch_TYPE}
          list_TYPE={list_TYPE}
          TOGGLE_vocabCard={TOGGLE_vocabCard}
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          OPEN_vocabCopyModal={OPEN_vocabCopyModal}
        />
      )}
    </View>
  );
});

const s = StyleSheet.create({
  _vocab: {
    width: "100%",
    minWidth: "100%",
    borderRadius: 12,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
  },
  _vocab_selectable: {
    borderColor: "white",
  },
  _vocab_selectable_selected: {
    borderColor: MyColors.border_primary,
  },
  vocab_open: {
    backgroundColor: MyColors.fill_bg,
  },
  difficulty_3: {
    borderColor: MyColors.border_difficulty_3,
  },
  difficulty_2: {
    borderColor: MyColors.border_difficulty_2,
  },
  difficulty_1: {
    borderColor: MyColors.border_difficulty_1,
  },
  difficulty_0: {
    borderColor: MyColors.border_primary,
  },
  highlighted: {
    borderColor: MyColors.border_green,
    backgroundColor: MyColors.btn_green,
  },
});
