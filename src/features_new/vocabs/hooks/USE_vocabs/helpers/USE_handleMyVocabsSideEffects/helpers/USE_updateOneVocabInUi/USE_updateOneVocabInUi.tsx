//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { vocabUpdate_TYPES } from "@/src/mitt/mitt";
import { SetStateAction, useCallback } from "react";

export const USE_updateOneVocabInUi = ({
  vocabs = [],
  SET_vocabs = () => {},
  highlight = () => {},
}: {
  vocabs: Vocab_TYPE[];
  SET_vocabs: (value: SetStateAction<Vocab_TYPE[]>) => void;
  highlight: (id: string | undefined) => void;
}) => {
  const UPDATE_oneVocabInUi = useCallback(
    (vocab: Vocab_TYPE, type: vocabUpdate_TYPES) => {
      SET_vocabs((prev) => prev.map((x) => (x.id === vocab.id ? vocab : x)));
      type === "full" ? highlight(vocab?.id) : null;
    },
    [vocabs, SET_vocabs]
  );

  return { UPDATE_oneVocabInUi };
};
