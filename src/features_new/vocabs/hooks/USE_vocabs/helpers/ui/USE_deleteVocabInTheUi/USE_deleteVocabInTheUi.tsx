//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { Global_EVENTS } from "@/src/mitt/mitt";
import { useEffect } from "react";

export function USE_deleteVocabInTheUi({
  DELETE_oneVocabInTheUi = () => {},
}: {
  DELETE_oneVocabInTheUi: (id: string) => void;
}) {
  useEffect(() => {
    const handler = (id: string) => DELETE_oneVocabInTheUi(id);
    Global_EVENTS.on("vocabDeleted", handler);
    return () => Global_EVENTS.off("vocabDeleted", handler);
  }, []);
}
