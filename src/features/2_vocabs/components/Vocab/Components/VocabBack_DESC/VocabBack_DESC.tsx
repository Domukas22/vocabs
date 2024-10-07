//
//
//

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
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
      {desc && <Styled_TEXT type="label_small">{desc}</Styled_TEXT>}
    </View>
  ) : null;
}
