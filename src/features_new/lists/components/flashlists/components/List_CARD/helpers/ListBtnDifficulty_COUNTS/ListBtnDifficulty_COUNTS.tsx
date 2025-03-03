//
//
//

import React from "react";
import { View } from "react-native";
import SingleVocabDifficulty_COUNT from "./SingleVocabDifficulty_COUNT/SingleVocabDifficulty_COUNT";
import {
  ICON_markedStar,
  ICON_star,
} from "@/src/components/1_grouped/icons/icons";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

export function ListBtnDifficulty_COUNTS({
  diff_1 = 0,
  diff_2 = 0,
  diff_3 = 0,
  marked = 0,
}: {
  diff_1: number;
  diff_2: number;
  diff_3: number;
  marked: number;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
      }}
    >
      {diff_3 > 0 ? (
        <SingleVocabDifficulty_COUNT count={diff_3} difficulty={3} />
      ) : null}

      {diff_2 > 0 ? (
        <SingleVocabDifficulty_COUNT count={diff_2} difficulty={2} />
      ) : null}
      {diff_1 > 0 ? (
        <SingleVocabDifficulty_COUNT count={diff_1} difficulty={1} />
      ) : null}
      {marked > 0 && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ICON_markedStar
            style={{ marginRight: 3 }}
            color="green"
            size="tiny"
          />
          <View>
            <Styled_TEXT
              type="text_14_bold"
              style={{ color: MyColors.text_green }}
            >
              {marked}
            </Styled_TEXT>
          </View>
        </View>
      )}
    </View>
  );
}
