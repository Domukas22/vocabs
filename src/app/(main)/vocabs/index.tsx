//
//
//

import React from "react";
import { ScrollView } from "react-native";

import { MyRecentLists_FLATLIST } from "@/src/features/lists/components";
import { MyColors } from "@/src/constants/MyColors";
import { VocabPageBigMain_BTNS } from "@/src/components/2_byPage/myVocabs";
import { USE_myStarterContent } from "@/src/hooks/starterContent/USE_myStarterContent/USE_myStarterContent";
import { MyDailyGoal_BLOCK } from "@/src/features/users/components/MyDailyGoal_BLOCK/MyDailyGoal_BLOCK";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { FETCH_vocabs } from "@/src/features_new/vocabs/functions/FETCH_vocabs/FETCH_vocabs";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_abortController } from "@/src/hooks";
import { supabase } from "@/src/lib/supabase";

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
        <MyDailyGoal_BLOCK />

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
