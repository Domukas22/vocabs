//
//
//

import list from "@/src/app/(main)/vocabs/list";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { t } from "i18next";
import React from "react";
import { View } from "react-native";
import SingleVocabDifficulty_COUNT from "./SingleVocabDifficulty_COUNT/SingleVocabDifficulty_COUNT";

export default function VocabDifficulty_COUNTS({
  difficulties,
}: {
  difficulties:
    | {
        diff_1_count: number;
        diff_2_count: number;
        diff_3_count: number;
      }
    | undefined;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
      {difficulties?.diff_1_count ? (
        <SingleVocabDifficulty_COUNT
          count={difficulties.diff_1_count}
          difficulty={1}
        />
      ) : null}
      {difficulties?.diff_2_count ? (
        <SingleVocabDifficulty_COUNT
          count={difficulties.diff_2_count}
          difficulty={2}
        />
      ) : null}
      {difficulties?.diff_3_count ? (
        <SingleVocabDifficulty_COUNT
          count={difficulties.diff_3_count}
          difficulty={3}
        />
      ) : null}
    </View>
  );
}
