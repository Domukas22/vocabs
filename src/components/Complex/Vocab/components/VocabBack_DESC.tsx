//
//
//

import { StyleSheet, View } from "react-native";
import { Styled_TEXT } from "../../../Basic/Styled_TEXT/Styled_TEXT";
import { Vocab_MODEL } from "@/src/db/models";
import { MyColors } from "@/src/constants/MyColors";

export default function VocabBack_DESC({ desc }: { desc: string | undefined }) {
  return desc ? (
    <View
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: MyColors.border_white_005,
      }}
    >
      <Styled_TEXT type="label_small">{desc}</Styled_TEXT>
    </View>
  ) : null;
}
