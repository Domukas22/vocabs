//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { StyleSheet, View } from "react-native";
import {
  VocabCardFront_SAVEDCOUNT,
  VocabCardFront_FLAGS,
  VocabCardFront_DIFFDOT,
  VocabCardFront_MARKEDSTAR,
} from "./_parts";
import { MyColors } from "@/src/constants/MyColors";
import { ICON_checkMark } from "@/src/components/1_grouped/icons/icons";

export function VocabCardFront_BOTTOM({
  vocab,
  SHOW_flags = false,
  SHOW_difficulty = false,
  IS_vocabSelectionOn = false,
  IS_selected = false,
}: {
  vocab: Vocab_TYPE;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  IS_vocabSelectionOn: boolean;
  IS_selected: boolean;
}) {
  const { is_marked = false } = vocab;

  return SHOW_flags || SHOW_difficulty || is_marked ? (
    <View style={s.contentWrap}>
      <View style={[s.iconWrap, { opacity: !IS_vocabSelectionOn ? 1 : 0 }]}>
        <VocabCardFront_SAVEDCOUNT {...{ vocab, SHOW_flags }} />
        <VocabCardFront_FLAGS {...{ vocab, SHOW_flags }} />
        <VocabCardFront_DIFFDOT {...{ vocab, SHOW_difficulty }} />
        <VocabCardFront_MARKEDSTAR {...{ vocab }} />
      </View>
      <View
        style={{
          height: 14,
          width: 14,
          position: "absolute",
          bottom: 0,
          right: 0,
          opacity: IS_vocabSelectionOn ? 1 : 0,
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: IS_selected ? MyColors.btn_active : MyColors.btn_3,
            borderRadius: 8,
            height: 32,
            width: 32,
            borderWidth: 1,
            borderColor: IS_selected
              ? MyColors.border_primary
              : MyColors.border_white_005,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {IS_selected ? <ICON_checkMark color="primary" /> : null}
        </View>
      </View>
    </View>
  ) : null;
}

const s = StyleSheet.create({
  contentWrap: {
    position: "relative",
  },
  iconWrap: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
