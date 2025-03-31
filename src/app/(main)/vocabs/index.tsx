//
//
//

import React, { useCallback } from "react";
import { ScrollView } from "react-native";

import { MyRecentLists_FLATLIST } from "@/src/features/lists/components";
import { MyColors } from "@/src/constants/MyColors";
import { VocabPageBigMain_BTNS } from "@/src/components/2_byPage/myVocabs";
import { USE_myStarterContent } from "@/src/hooks/starterContent/USE_myStarterContent/USE_myStarterContent";
import { supabase } from "@/src/lib/supabase";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

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

  const { z_user } = z_USE_user();

  const test = useCallback(async () => {
    const { data, error } = await supabase.rpc("fetch_filtered_random_vocabs", {
      list_type: "private",
      fetch_type: "all",
      user_uuid: z_user?.id || null,
      list_uuid: null,
      search_text: "break",
      exclude_ids: [],
      marked: "false",
      difficulties: [],
      langs: [],
    });

    if (error) console.error(error);
    else
      console.log(
        "HERE: ",
        data.map((y) => y?.trs?.[0]?.text)
      );
  }, []);

  return (
    <>
      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <Btn text="Test" onPress={test} />
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
