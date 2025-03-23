//

import vocabs from "@/src/app/(main)/vocabs";
import { List_TYPE } from "@/src/features_new/lists/types";
import { SetStateAction, useCallback } from "react";

export const USE_deleteOneListFromUi = ({
  SET_lists = () => {},
  SET_unpaginatedCount = () => {},
}: {
  SET_lists: (value: SetStateAction<List_TYPE[]>) => void;
  SET_unpaginatedCount: (value: SetStateAction<number>) => void;
}) => {
  const DELETE_oneListFromUi = useCallback(
    (list_ID: string) => {
      SET_lists((prev) => prev.filter((x) => x.id !== list_ID));
      SET_unpaginatedCount((prev) => prev - 1);
    },
    [vocabs, SET_lists]
  );

  return { DELETE_oneListFromUi };
};
