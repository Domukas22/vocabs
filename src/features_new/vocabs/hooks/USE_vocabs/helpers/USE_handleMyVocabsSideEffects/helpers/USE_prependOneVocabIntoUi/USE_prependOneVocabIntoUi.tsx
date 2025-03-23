//

import vocabs from "@/src/app/(main)/vocabs";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { SetStateAction, useCallback } from "react";

export const USE_prependOneVocabIntoUi = ({
  SET_vocabs = () => {},
  SET_unpaginatedCount = () => {},
  highlight = () => {},
}: {
  SET_vocabs: (value: SetStateAction<Vocab_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
  highlight: (id: string | undefined) => void;
}) => {
  const PREPEND_oneVocabIntoUi = useCallback(
    (vocab: Vocab_TYPE) => {
      SET_vocabs((prev) => [vocab, ...prev]);
      SET_unpaginatedCount((prev) => prev + 1);
      highlight(vocab?.id);
    },
    [vocabs, SET_vocabs, SET_unpaginatedCount, highlight]
  );

  return { PREPEND_oneVocabIntoUi };
};
