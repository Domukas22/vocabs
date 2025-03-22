//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { Global_EVENTS } from "@/src/mitt/mitt";
import { useEffect } from "react";

export function USE_createVocabInTheUi({
  CREATE_oneVocabInTheUi = () => {},
}: {
  CREATE_oneVocabInTheUi: (vocab: Vocab_TYPE) => void;
}) {
  useEffect(() => {
    const handler = (vocab: Vocab_TYPE) => CREATE_oneVocabInTheUi(vocab);
    Global_EVENTS.on("vocabCreated", handler);
    return () => Global_EVENTS.off("vocabCreated", handler);
  }, []);
}
