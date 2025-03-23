//

import vocabs from "@/src/app/(main)/vocabs";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { SetStateAction, useCallback } from "react";

export const USE_deleteOneVocabFromUi = ({
  SET_vocabs = () => {},
  SET_unpaginatedCount = () => {},
}: {
  SET_vocabs: (value: SetStateAction<Vocab_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
}) => {
  const DELETE_oneVocabFromUi = useCallback(
    (vocab_ID: string, list_ID: string) => {
      SET_vocabs((prev) => prev.filter((x) => x.id !== vocab_ID));
      SET_unpaginatedCount((prev) => prev - 1);
    },
    [vocabs, SET_vocabs]
  );

  return { DELETE_oneVocabFromUi };
};
