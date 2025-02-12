//
//
//

import { View } from "react-native";
import { ICON_flag } from "@/src/components/1_grouped/icons/icons";
import Highlighted_TEXT from "@/src/components/1_grouped/texts/Highlighted_TEXT/Highlighted_TEXT";
import { StyleSheet } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import { VocabTr_TYPE } from "@/src/features/vocabs/types";

export function VocabBack_TRS({
  trs,
  difficulty = 0,
}: {
  trs: VocabTr_TYPE[];
  difficulty: 0 | 1 | 2 | 3 | undefined;
}) {
  return trs && trs.length > 0
    ? trs.map((tr) => (
        <View key={tr.text + "vocabBackTrText" + tr.lang_id} style={s.bottomTr}>
          <View style={s.bottomVocabFlag_WRAP}>
            <ICON_flag big={true} lang={tr.lang_id} />
          </View>

          <View style={s.trText_WRAP}>
            <Highlighted_TEXT
              text={tr.text}
              highlights={tr.highlights}
              diff={difficulty}
            />
          </View>
        </View>
      ))
    : null;
}

const s = StyleSheet.create({
  bottomTr: {
    flexDirection: "row",
    minHeight: 60,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  bottomVocabFlag_WRAP: {
    justifyContent: "center",
    alignItems: "center",
    height: 58,
    width: 50,
  },
  trText_WRAP: {
    paddingVertical: 16,
    paddingRight: 12,
    flex: 1,
  },
});
