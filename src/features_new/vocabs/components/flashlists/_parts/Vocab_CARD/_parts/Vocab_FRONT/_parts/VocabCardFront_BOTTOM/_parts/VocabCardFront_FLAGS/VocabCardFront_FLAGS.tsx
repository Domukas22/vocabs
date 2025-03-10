//
//
//

import { ICON_flag } from "@/src/components/1_grouped/icons/icons";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { useMemo } from "react";
import { View } from "react-native";

export function VocabCardFront_FLAGS({
  vocab,
  SHOW_flags = false,
}: {
  vocab: Vocab_TYPE;
  SHOW_flags: boolean;
}) {
  const { trs = [] } = vocab;
  const show = useMemo(() => SHOW_flags && trs.length > 0, [SHOW_flags, vocab]);

  return (
    <View style={{ flexDirection: "row", gap: 4 }}>
      {show
        ? trs.map((tr) => (
            <ICON_flag key={"FrontFlag" + tr.lang_id} lang={tr.lang_id} big />
          ))
        : null}
    </View>
  );
}
