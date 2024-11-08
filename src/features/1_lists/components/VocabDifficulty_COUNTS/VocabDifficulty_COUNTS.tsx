//
//
//

import React from "react";
import { View } from "react-native";
import SingleVocabDifficulty_COUNT from "./SingleVocabDifficulty_COUNT/SingleVocabDifficulty_COUNT";
import { ICON_star } from "@/src/components/icons/icons";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

export default function VocabDifficulty_COUNTS({
  diff_1_count = 0,
  diff_2_count = 0,
  diff_3_count = 0,
  markedVocab_COUNT = 0,
}: {
  diff_1_count: number;
  diff_2_count: number;
  diff_3_count: number;
  markedVocab_COUNT: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 4,
      }}
    >
      {diff_3_count > 0 ? (
        <SingleVocabDifficulty_COUNT count={diff_3_count} difficulty={3} />
      ) : null}

      {diff_2_count > 0 ? (
        <SingleVocabDifficulty_COUNT count={diff_2_count} difficulty={2} />
      ) : null}
      {diff_1_count > 0 ? (
        <SingleVocabDifficulty_COUNT count={diff_1_count} difficulty={1} />
      ) : null}
      {markedVocab_COUNT > 0 && (
        <View style={{ flexDirection: "row", gap: 0, alignItems: "center" }}>
          <ICON_star extraSmall style={{ marginHorizontal: 4 }} color="green" />
          <View>
            <Styled_TEXT
              type="text_14_bold"
              style={{ color: MyColors.text_green }}
            >
              {markedVocab_COUNT}
            </Styled_TEXT>
          </View>
        </View>
      )}
    </View>
  );
}
