//
//
//
//

import { Pressable, StyleSheet, View } from "react-native";
import { Styled_TEXT } from "../../../../components/Styled_TEXT/Styled_TEXT";

import { MyColors } from "@/src/constants/MyColors";
import { ICON_difficultyDot } from "../../../../components/icons/icons";
import { List_MODEL } from "@/src/db/models";
import { useTranslation } from "react-i18next";

import { useMemo } from "react";
import GET_listDifficulties from "../../utils/GET_listDifficulties";
import VocabDifficulty_COUNTS from "../VocabDifficulty_COUNTS/VocabDifficulty_COUNTS";

export default function MyList_BTN({
  list,
  onPress,
  highlighted,
}: {
  list: List_MODEL;
  onPress: () => void;
  highlighted: boolean;
}) {
  const { t } = useTranslation();
  const difficulties = useMemo(() => GET_listDifficulties(list), []);

  return (
    <Pressable
      style={({ pressed }) => [
        s.btn,
        pressed && s.pressed,
        highlighted && s.highlighted,
        { width: "100%", minWidth: "100%" },
      ]}
      onPress={onPress}
    >
      <Styled_TEXT type="text_18_bold" style={{ textAlign: "left", flex: 1 }}>
        {list?.name || "INSERT LIST NAME"}
      </Styled_TEXT>

      <Styled_TEXT type="label_small" style={{ textAlign: "left" }}>
        {list.vocabs && list.vocabs?.length > 0
          ? `${list.vocabs.length} ${t("other.vocabs")}`
          : t("other.emptyList")}
      </Styled_TEXT>

      <VocabDifficulty_COUNTS {...{ difficulties }} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  btn: {
    borderWidth: 1,
    borderColor: MyColors.border_white_005,

    backgroundColor: MyColors.btn_2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 12,
    gap: 2,
    flex: 1,
    width: "100%",
  },
  pressed: {
    backgroundColor: MyColors.btn_3,
  },
  highlighted: {
    backgroundColor: MyColors.btn_green,
    borderColor: MyColors.border_green,
  },
});

function VocabDifficultyCount({
  count,
  difficulty,
}: {
  count: number;
  difficulty: 1 | 2 | 3;
}) {
  const textColor = {
    color:
      difficulty === 3
        ? MyColors.text_difficulty_3
        : difficulty === 2
        ? MyColors.text_difficulty_2
        : MyColors.text_difficulty_1,
  };

  return (
    <View style={{ flexDirection: "row", gap: 2, alignItems: "center" }}>
      <ICON_difficultyDot big={true} difficulty={difficulty} />
      <View>
        <Styled_TEXT type="text_15_bold" style={textColor}>
          {count}
        </Styled_TEXT>
      </View>
    </View>
  );
}
