//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { Global_EVENTS } from "@/src/mitt/mitt";
import { useEffect } from "react";

export function USE_updateVocabInTheUi({
  UPDATE_oneVocabInTheUi = () => {},
}: {
  UPDATE_oneVocabInTheUi: (vocab: Vocab_TYPE) => void;
}) {
  useEffect(() => {
    const handler = (vocab: Vocab_TYPE) => UPDATE_oneVocabInTheUi(vocab);
    Global_EVENTS.on("vocabUpdated", handler);
    return () => Global_EVENTS.off("vocabUpdated", handler);
  }, []);
}
