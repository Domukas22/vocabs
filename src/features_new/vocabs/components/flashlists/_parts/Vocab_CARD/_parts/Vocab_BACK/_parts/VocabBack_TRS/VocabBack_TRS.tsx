//
//
//

import { View } from "react-native";
import { ICON_flag } from "@/src/components/1_grouped/icons/icons";
import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import { StyleSheet } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export const VocabBack_TRS = React.memo(function VocabBack_TRS({
  vocab,
}: {
  vocab: Vocab_TYPE;
}) {
  if (!vocab?.trs || vocab?.trs.length === 0) return null;

  return vocab.trs.map((tr) => (
    <View key={tr.text + "vocabBackTrText" + tr.lang_id} style={s.bottomTr}>
      <View style={s.bottomVocabFlag_WRAP}>
        <ICON_flag big={true} lang={tr.lang_id} />
      </View>

      <View style={s.trText_WRAP}>
        <Highlighted_TEXT
          text={tr.text}
          highlights={tr.highlights}
          diff={vocab.difficulty || 0}
        />
      </View>
    </View>
  ));
});
//

const s = StyleSheet.create({
  bottomTr: {
    flexDirection: "row",
    minHeight: 52,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  bottomVocabFlag_WRAP: {
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    width: 50,
  },
  trText_WRAP: {
    paddingVertical: 12,
    paddingRight: 14,
    flex: 1,
  },
});
