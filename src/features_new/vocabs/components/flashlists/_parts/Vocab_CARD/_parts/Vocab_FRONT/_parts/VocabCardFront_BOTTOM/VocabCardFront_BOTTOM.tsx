//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { StyleSheet, View } from "react-native";
import {
  VocabCardFront_SAVEDCOUNT,
  VocabCardFront_FLAGS,
  VocabCardFront_DIFFDOT,
  VocabCardFront_MARKEDSTAR,
} from "./_parts";

export function VocabCardFront_BOTTOM({
  vocab,
  SHOW_flags = false,
  SHOW_difficulty = false,
}: {
  vocab: Vocab_TYPE;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
}) {
  const { is_marked = false } = vocab;

  return SHOW_flags || SHOW_difficulty || is_marked ? (
    <View style={s.iconWrap}>
      <VocabCardFront_SAVEDCOUNT {...{ vocab, SHOW_flags }} />
      <VocabCardFront_FLAGS {...{ vocab, SHOW_flags }} />
      <VocabCardFront_DIFFDOT {...{ vocab, SHOW_difficulty }} />
      <VocabCardFront_MARKEDSTAR {...{ vocab }} />
    </View>
  ) : null;
}

const s = StyleSheet.create({
  iconWrap: {
    flexDirection: "row",
    gap: 6,
    marginTop: 12,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
