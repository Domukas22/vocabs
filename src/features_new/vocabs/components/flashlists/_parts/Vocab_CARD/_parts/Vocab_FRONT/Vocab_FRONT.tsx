//
//
//

import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MyColors } from "@/src/constants/MyColors";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import {
  VocabCardFront_BOTTOM,
  VocabCardFront_DESC,
  VocabCardFront_TR,
} from "./_parts";

interface VocabFront_PROPS {
  vocab: Vocab_TYPE;
  highlighted?: boolean;
  IS_selected?: boolean;
  IS_vocabSelectionOn?: boolean;
  TOGGLE_open: () => void;
}

export const Vocab_FRONT = React.memo(function Vocab_FRONT({
  vocab,
  highlighted = false,
  IS_vocabSelectionOn = false,
  TOGGLE_open,
  IS_selected = false,
}: VocabFront_PROPS) {
  const { appearance } = z_USE_myVocabsDisplaySettings();

  const {
    SHOW_description = false,
    SHOW_difficulty = false,
    SHOW_flags = false,
    frontTrLang_ID = "en",
  } = appearance;

  return (
    <Pressable
      style={({ pressed }) => [
        s.parent,
        pressed && s.parentPressed,
        highlighted && s.parentHighlighted,
        IS_selected && IS_vocabSelectionOn && s.selected,
      ]}
      onPress={TOGGLE_open}
    >
      <View style={s.content}>
        <VocabCardFront_TR
          {...{ vocab, frontTrLang_ID, IS_vocabSelectionOn, IS_selected }}
        />
        <VocabCardFront_DESC {...{ vocab, SHOW_description }} />
        <VocabCardFront_BOTTOM
          {...{
            vocab,
            SHOW_difficulty,
            SHOW_flags,
            IS_vocabSelectionOn,
            IS_selected,
          }}
        />
      </View>
    </Pressable>
  );
});

const s = StyleSheet.create({
  parent: {
    backgroundColor: MyColors.btn_2,
  },
  selected: {
    backgroundColor: MyColors.btn_active,
  },
  parentPressed: {
    backgroundColor: MyColors.btn_3,
  },
  parentHighlighted: {
    backgroundColor: MyColors.btn_green,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 12,
  },
});
