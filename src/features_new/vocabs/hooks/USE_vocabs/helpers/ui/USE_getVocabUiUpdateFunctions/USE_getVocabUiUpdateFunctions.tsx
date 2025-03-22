//
//
//

import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { SetStateAction, useCallback } from "react";

export function USE_getVocabUiUpdateFunctions({
  vocabs = [],
  SET_vocabs = () => {},
  SET_unpaginatedCount = () => {},
  highlight = () => {},
}: {
  vocabs: Vocab_TYPE[];
  SET_vocabs: (value: SetStateAction<Vocab_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
  highlight: (id: string | undefined) => void;
}) {
  const UPDATE_oneVocabInTheUi = useCallback(
    (vocab: Vocab_TYPE) => {
      SET_vocabs((prev) => prev.map((x) => (x.id === vocab.id ? vocab : x)));
      highlight(vocab?.id);
    },
    [vocabs, SET_vocabs]
  );

  const CREATE_oneVocabInTheUi = useCallback(
    (vocab: Vocab_TYPE) => {
      SET_vocabs((prev) => [vocab, ...prev]);
      SET_unpaginatedCount((prev) => prev + 1);
      highlight(vocab?.id);
    },
    [vocabs, SET_vocabs]
  );

  const DELETE_oneVocabInTheUi = useCallback(
    (id: string) => {
      SET_vocabs((prev) => prev.filter((x) => x.id !== id));
      SET_unpaginatedCount((prev) => prev - 1);
    },
    [vocabs, SET_vocabs]
  );

  return {
    UPDATE_oneVocabInTheUi,
    CREATE_oneVocabInTheUi,
    DELETE_oneVocabInTheUi,
  };
}
