//
//
//

import { List_TYPE } from "@/src/features_new/lists/types";
import { General_ERROR } from "@/src/types/error_TYPES";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { useState } from "react";
import { USE_setMyStarterContent } from "./USE_setMyStarterContent/USE_setMyStarterContent";
import USE_myStarterContentSideEffects from "./USE_myStarterContentSideEffects/USE_myStarterContentSideEffects";

export function USE_myStarterContent() {
  const [top_LISTS, SET_topLists] = useState<List_TYPE[]>([]);
  const [totalList_COUNT, SET_totalListCount] = useState<number>(0);
  const [savedVocab_COUNT, SET_savedVocabCount] = useState<number>(0);
  const [allVocab_COUNT, SET_allVocabCount] = useState<number>(0);
  const [deletedVocab_COUNT, SET_deletedVocabCount] = useState<number>(0);

  const [error, SET_error] = useState<General_ERROR>();
  const [loading, SET_loading] =
    useState<starterContentLoading_TYPE>("initial");

  const { SET_myStarterContent } = USE_setMyStarterContent({
    SET_topLists,
    SET_totalListCount,
    SET_savedVocabCount,
    SET_allVocabCount,
    SET_deletedVocabCount,
  });

  USE_myStarterContentSideEffects({
    SET_error,
    SET_loading,
    SET_myStarterContent,
  });

  return {
    top_LISTS,
    totalList_COUNT,
    savedVocab_COUNT,
    allVocab_COUNT,
    deletedVocab_COUNT,
    error,
    loading,
  };
}
