//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { Dispatch, SetStateAction, useCallback } from "react";

export type SET_myStarterContent_PROPS = {
  top_LISTS: List_TYPE[];
  totalList_COUNT: number;
  savedVocab_COUNT: number;
  allVocab_COUNT: number;
  deletedVocab_COUNT: number;
};

export function USE_setMyStarterContent({
  SET_topLists = () => {},
  SET_totalListCount = () => {},
  SET_savedVocabCount = () => {},
  SET_allVocabCount = () => {},
  SET_deletedVocabCount = () => {},
}: {
  SET_topLists: Dispatch<SetStateAction<List_TYPE[]>>;
  SET_totalListCount: Dispatch<SetStateAction<number>>;
  SET_savedVocabCount: Dispatch<SetStateAction<number>>;
  SET_allVocabCount: Dispatch<SetStateAction<number>>;
  SET_deletedVocabCount: Dispatch<SetStateAction<number>>;
}) {
  const SET_myStarterContent = useCallback(
    (props: SET_myStarterContent_PROPS) => {
      const {
        top_LISTS = [],
        totalList_COUNT = 0,
        savedVocab_COUNT = 0,
        allVocab_COUNT = 0,
        deletedVocab_COUNT = 0,
      } = props;

      SET_topLists(top_LISTS);
      SET_totalListCount(totalList_COUNT);
      SET_savedVocabCount(savedVocab_COUNT);
      SET_allVocabCount(allVocab_COUNT);
      SET_deletedVocabCount(deletedVocab_COUNT);
    },
    [
      SET_topLists,
      SET_totalListCount,
      SET_savedVocabCount,
      SET_allVocabCount,
      SET_deletedVocabCount,
    ]
  );

  return { SET_myStarterContent };
}
