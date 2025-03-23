//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { Dispatch, SetStateAction, useCallback } from "react";

export type SET_publicStarterContent_PROPS = {
  top_LISTS: List_TYPE[];
  top_VOCABS: Vocab_TYPE[];
  totalList_COUNT: number;
  totalVocab_COUNT: number;
};

export function USE_setPublicStarterContent({
  SET_topLists = () => {},
  SET_topVocabs = () => {},
  SET_totalListCount = () => {},
  SET_totalVocabCount = () => {},
}: {
  SET_topLists: Dispatch<SetStateAction<List_TYPE[]>>;
  SET_totalListCount: Dispatch<SetStateAction<number>>;
  SET_topVocabs: Dispatch<SetStateAction<Vocab_TYPE[]>>;
  SET_totalVocabCount: Dispatch<SetStateAction<number>>;
}) {
  const SET_publicStarterContent = useCallback(
    (props: SET_publicStarterContent_PROPS) => {
      const {
        top_LISTS = [],
        top_VOCABS = [],
        totalList_COUNT = 0,
        totalVocab_COUNT = 0,
      } = props;

      SET_topLists(top_LISTS);
      SET_topVocabs(top_VOCABS);
      SET_totalListCount(totalList_COUNT);
      SET_totalVocabCount(totalVocab_COUNT);
    },
    [SET_topLists, SET_totalListCount, SET_topVocabs, SET_totalVocabCount]
  );

  return { SET_publicStarterContent };
}
