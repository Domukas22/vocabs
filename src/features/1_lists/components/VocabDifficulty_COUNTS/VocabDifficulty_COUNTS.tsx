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
        difficulty_1: number;
        difficulty_2: number;
        difficulty_3: number;
      }
    | undefined;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, justifyContent: "flex-end" }}>
      {difficulties?.difficulty_1 ? (
        <SingleVocabDifficulty_COUNT
          count={difficulties.difficulty_1}
          difficulty={1}
        />
      ) : null}
      {difficulties?.difficulty_2 ? (
        <SingleVocabDifficulty_COUNT
          count={difficulties.difficulty_2}
          difficulty={2}
        />
      ) : null}
      {difficulties?.difficulty_3 ? (
        <SingleVocabDifficulty_COUNT
          count={difficulties.difficulty_3}
          difficulty={3}
        />
      ) : null}
    </View>
  );
}
