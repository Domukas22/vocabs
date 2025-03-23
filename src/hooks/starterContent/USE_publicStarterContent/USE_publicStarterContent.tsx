//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { useState } from "react";
import { USE_setPublicStarterContent } from "./USE_setPublicStarterContent/USE_setPublicStarterContent";
import USE_myStarterContentSideEffects from "./USE_publicStarterContentSideEffects/USE_publicStarterContentSideEffects";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function USE_publicStarterContent() {
  const [top_LISTS, SET_topLists] = useState<List_TYPE[]>([]);
  const [totalList_COUNT, SET_totalListCount] = useState<number>(0);

  const [top_VOCABS, SET_topVocabs] = useState<Vocab_TYPE[]>([]);
  const [totalVocab_COUNT, SET_totalVocabCount] = useState<number>(0);

  const [error, SET_error] = useState<General_ERROR>();
  const [loading, SET_loading] =
    useState<starterContentLoading_TYPE>("initial");

  const { SET_publicStarterContent } = USE_setPublicStarterContent({
    SET_topLists,
    SET_totalListCount,
    SET_topVocabs,
    SET_totalVocabCount,
  });

  USE_myStarterContentSideEffects({
    SET_error,
    SET_loading,
    SET_publicStarterContent,
  });

  return {
    top_LISTS,
    top_VOCABS,
    totalList_COUNT,
    totalVocab_COUNT,
    error,
    loading,
  };
}
