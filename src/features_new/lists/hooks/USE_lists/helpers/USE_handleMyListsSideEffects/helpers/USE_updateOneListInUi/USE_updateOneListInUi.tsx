//

import { List_TYPE } from "@/src/features_new/lists/types";
import { SetStateAction, useCallback } from "react";

export const USE_updateOneListInUi = ({
  lists = [],
  SET_lists = () => {},
}: {
  lists: List_TYPE[];
  SET_lists: (value: SetStateAction<List_TYPE[]>) => void;
}) => {
  const UPDATE_oneListInUi = useCallback(
    (list: List_TYPE) => {
      SET_lists((prev) => prev.map((x) => (x.id === list.id ? list : x)));
    },
    [lists, SET_lists]
  );

  return { UPDATE_oneListInUi };
};
