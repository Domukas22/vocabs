//
//
//

import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";

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
}

export const Vocab_CARD = React.memo(function MyVocab_CARD({
  vocab,
  list_TYPE,
  fetch_TYPE,
  highlighted = false,
  OPEN_updateVocabModal = () => {},
  OPEN_vocabCopyModal = () => {},
}: VocabProps) {
  const [open, TOGGLE_vocabCard] = USE_toggle();

  const styles = useMemo(
    () => [
      s._vocab,
      open && s.vocab_open,
      open && s[`difficulty_${vocab?.difficulty || 0}`],
      highlighted && s.highlighted,
    ],
    [open, vocab?.difficulty, highlighted]
  );

  return (
    <View style={styles}>
      {!open ? (
        <Vocab_FRONT
          vocab={vocab}
          highlighted={highlighted}
          TOGGLE_open={TOGGLE_vocabCard}
         
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
