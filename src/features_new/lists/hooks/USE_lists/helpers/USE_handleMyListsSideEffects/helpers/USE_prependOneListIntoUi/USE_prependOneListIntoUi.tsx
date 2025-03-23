//

import vocabs from "@/src/app/(main)/vocabs";
import { List_TYPE } from "@/src/features_new/lists/types";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { SetStateAction, useCallback } from "react";

export const USE_prependOneListIntoUi = ({
  SET_lists = () => {},
  SET_unpaginatedCount = () => {},
  highlight = () => {},
}: {
  SET_lists: (value: SetStateAction<List_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
  highlight: (id: string | undefined) => void;
}) => {
  const PREPEND_oneListIntoUi = useCallback(
    (list: List_TYPE) => {
      SET_lists((prev) => [list, ...prev]);
      SET_unpaginatedCount((prev) => prev + 1);
      highlight(list?.id);
    },
    [vocabs, SET_lists, SET_unpaginatedCount, highlight]
  );

  return { PREPEND_oneListIntoUi };
};
