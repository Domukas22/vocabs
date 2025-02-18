//
//

import { ICON_difficultyDot } from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";

//
export default function SingleVocabDifficulty_COUNT({
  count,
  difficulty,
}: {
  count: number;
  difficulty: 0 | 1 | 2 | 3;
}) {
  const textColor = {
    color:
      difficulty === 3
        ? MyColors.text_difficulty_3
        : difficulty === 2
        ? MyColors.text_difficulty_2
        : difficulty === 1
        ? MyColors.text_difficulty_1
        : MyColors.text_primary,
  };

  return (
    <View style={{ flexDirection: "row", gap: 0, alignItems: "center" }}>
      <ICON_difficultyDot difficulty={difficulty} />
      <View>
        <Styled_TEXT type="text_14_bold" style={textColor}>
          {count}
        </Styled_TEXT>
      </View>
    </View>
  );
}
