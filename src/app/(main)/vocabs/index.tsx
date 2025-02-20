//
//
//

import React, { useEffect } from "react";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ActivityIndicator, ScrollView } from "react-native";

import { MyRecentLists_FLATLIST } from "@/src/features/lists/components";
import { MyColors } from "@/src/constants/MyColors";
import { VocabPageBigMain_BTNS } from "@/src/components/2_byPage/myVocabs";
import USE_refetchStarterContent from "@/src/hooks/zustand/z_USE_myStarterContent/USE_refetchStarterContent/USE_refetchStarterContent";
import { z_USE_myStarterContent } from "@/src/hooks/zustand/z_USE_myStarterContent/z_USE_myStarterContent";

export default function Index_PAGE() {
  const { z_IS_myStarterContentRefetching } = z_USE_myStarterContent();
  const { REFETCH_myStarterContent } = USE_refetchStarterContent();

  useEffect(() => {
    REFETCH_myStarterContent(true);
  }, []);

  return (
    <>
      <Header
        title="My vocabs"
        big={true}
        btnRight={
          z_IS_myStarterContentRefetching ? (
            <ActivityIndicator color={MyColors.icon_gray} />
          ) : null
        }
      />
      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <MyRecentLists_FLATLIST />
        <VocabPageBigMain_BTNS />
      </ScrollView>
    </>
  );
}
