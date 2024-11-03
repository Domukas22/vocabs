//
//
//

import React from "react";
import { View } from "react-native";
import SingleVocabDifficulty_COUNT from "./SingleVocabDifficulty_COUNT/SingleVocabDifficulty_COUNT";

export default function VocabDifficulty_COUNTS({
  diff_1_count,
  diff_2_count = 0,
  diff_3_count = 0,
}: {
  diff_1_count: number;
  diff_2_count: number;
  diff_3_count: number;
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
    </View>
  );
}
