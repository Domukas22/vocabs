//
//
//

import { Translation_MODEL, Vocab_MODEL } from "@/src/db/models";
import { View } from "react-native";
import { ICON_flag } from "../../icons/icons";
import RENDER_textWithHighlights from "../../RENDER_textWithHighlights/RENDER_textWithHighlights";
import { Styled_TEXT } from "../../Styled_TEXT/Styled_TEXT";
import { StyleSheet } from "react-native";
import { MyColors } from "@/src/constants/MyColors";

export default function VocabBack_TRs({
  TRs,
  difficulty,
}: {
  TRs: Translation_MODEL[] | undefined;
  difficulty: 0 | 1 | 2 | 3;
}) {
  return TRs
    ? TRs.map((tr) => (
        <View key={tr.text} style={s.bottomTr}>
          <View style={s.bottomVocabFlag_WRAP}>
            <ICON_flag big={true} lang={tr.lang_id} />
          </View>
          <Styled_TEXT
            type="vocabTitle"
            style={{ paddingVertical: 16, flex: 1 }}
          >
            <RENDER_textWithHighlights
              text={tr.text}
              highlights={tr.highlights}
              modal_DIFF={difficulty}
            />
          </Styled_TEXT>
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
});
