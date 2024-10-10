//
//
//

import { Translation_MODEL } from "@/src/db/props";
import { View } from "react-native";
import { ICON_flag } from "@/src/components/icons/icons";
import Highlighted_TEXT from "@/src/components/Highlighted_TEXT/Highlighted_TEXT";
import { StyleSheet } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

export default function VocabBack_TRS({
  TRs,
  difficulty = 0,
}: {
  TRs: Translation_MODEL[] | undefined;
  difficulty: 0 | 1 | 2 | 3 | undefined;
}) {
  return TRs
    ? TRs.map((tr) => (
        <View key={tr.text + "vocabBackTrText" + tr.id} style={s.bottomTr}>
          <View style={s.bottomVocabFlag_WRAP}>
            <ICON_flag big={true} lang={tr.lang_id} />
          </View>
          {tr?.highlights && (
            <View style={s.trText_WRAP}>
              <Highlighted_TEXT
                text={tr.text}
                highlights={tr.highlights}
                diff={difficulty}
              />
            </View>
          )}
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
