//
//
//

import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

export default function VocabBottomText_WRAP({
  desc,
  list_NAME,
}: {
  desc: string | undefined;
  list_NAME?: string | undefined;
}) {
  return desc ? (
    <View
      style={{
        padding: 12,
        borderBottomWidth: 1,
        borderColor: MyColors.border_white_005,
      }}
    >
      {desc && <Styled_TEXT type="label_small">{desc}</Styled_TEXT>}
      {list_NAME && (
        <Styled_TEXT type="label_small">List: {list_NAME}</Styled_TEXT>
      )}
    </View>
  ) : null;
}
