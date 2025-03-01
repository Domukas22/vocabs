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
import { COLLECT_allMyListsLangIds } from "@/src/features_new/lists/functions/fetch/COLLECT_allMyListsLangIds/COLLECT_allMyListsLangIds";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { USE_abortController } from "@/src/hooks";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { supabase } from "@/src/lib/supabase";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";

export default function Index_PAGE() {
  const { z_IS_myStarterContentRefetching } = z_USE_myStarterContent();
  const { REFETCH_myStarterContent } = USE_refetchStarterContent();

  useEffect(() => {
    REFETCH_myStarterContent(true);
  }, []);

  //////////////////////////////////////////////////
  // const { z_user } = z_USE_user();
  // const fetch = async () => {
  //   const { data } = await supabase
  //     .from("lists_extended")
  //     .select("name, vocab_infos")
  //     .eq("user_id", z_user?.id || "")
  //     .ilike("name", "%vocabs%")
  //     .order("vocab_infos->>total", { ascending: false });

  //   console.log(data);
  // };

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
      {/* <Btn text="Fetch" onPress={fetch} /> */}
      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <MyRecentLists_FLATLIST />
        <VocabPageBigMain_BTNS />
      </ScrollView>
    </>
  );
}
