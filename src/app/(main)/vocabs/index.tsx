//
//
//

import React from "react";
import { ScrollView } from "react-native";

import { MyRecentLists_FLATLIST } from "@/src/features/lists/components";
import { MyColors } from "@/src/constants/MyColors";
import { VocabPageBigMain_BTNS } from "@/src/components/2_byPage/myVocabs";
import { USE_myStarterContent } from "@/src/hooks/starterContent/USE_myStarterContent/USE_myStarterContent";

export default function Index_PAGE() {
  const {
    top_LISTS,
    totalList_COUNT,
    savedVocab_COUNT,
    allVocab_COUNT,
    deletedVocab_COUNT,
    error,
    loading,
  } = USE_myStarterContent();

  return (
    <>
      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <MyRecentLists_FLATLIST
          top_LISTS={top_LISTS}
          totalList_COUNT={totalList_COUNT}
          loading={loading}
        />
        <VocabPageBigMain_BTNS
          savedVocab_COUNT={savedVocab_COUNT}
          allVocab_COUNT={allVocab_COUNT}
          deletedVocab_COUNT={deletedVocab_COUNT}
          loading={loading}
        />
      </ScrollView>
    </>
  );
}
