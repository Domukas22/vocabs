//
//
//

import { View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export default function CurrentVocabCount_BAR({
  totalUserVocab_COUNT = 0,
  max_vocabs = 1, // Default to 1 to avoid division by zero
  color = "primary",
}: {
  totalUserVocab_COUNT: number;
  max_vocabs: number;
  color?: "primary" | "white";
}) {
  // Calculate the proportional width percentage based on current and max vocab counts
  const widthPercentage = (totalUserVocab_COUNT / max_vocabs) * 100;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
      }}
    >
      <Styled_TEXT
        type="text_18_bold"
        style={{
          color: color === "primary" ? MyColors.text_primary : "white",
        }}
      >
        {totalUserVocab_COUNT}
      </Styled_TEXT>
      <View
        style={{
          height: 12,
          flex: 1,
          borderRadius: 50,
          borderWidth: 1,
          borderColor: MyColors.border_white_005,
          backgroundColor: MyColors.btn_3,
          marginTop: 2,
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${Math.min(widthPercentage, 100)}%`, // Limit to 100%
            borderRadius: 50,
            backgroundColor:
              color === "primary" ? MyColors.icon_primary : "white",
          }}
        ></View>
      </View>
      <Styled_TEXT
        type="text_18_bold"
        style={{
          color: MyColors.text_white_06,
        }}
      >
        {max_vocabs}
      </Styled_TEXT>
    </View>
  );
}
