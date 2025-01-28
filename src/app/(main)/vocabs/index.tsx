//
//
//

import React, { useState } from "react";
import { Pressable } from "react-native";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import { ScrollView } from "react-native";
import Confirmation_MODAL from "@/src/components/1_grouped/modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";

import { Portal } from "@gorhom/portal";
import { MyRecentLists_FLATLIST } from "@/src/features/lists/components";
import { USE_myProfileObservables } from "@/src/features/users/functions/fetch/hooks/USE_myProfileObservables/USE_myProfileObservables";
import { MyColors } from "@/src/constants/MyColors";
import { USE_resetDatabase, USE_routerPush } from "@/src/hooks";
import { VocabPageBigMain_BTNS } from "@/src/components/2_byPage/myVocabs";

export default function Index_PAGE() {
  const { PUSH_router } = USE_routerPush();
  const { RESET_database } = USE_resetDatabase();
  const [IS_resetDbModalOpen, SET_resetDbModalOpen] = useState(false);

  const {
    totalUserList_COUNT,
    totalUserVocab_COUNT,
    totalSavedVocab_COUNT,
    deletedUserVocab_COUNT,
    myTopLists,
  } = USE_myProfileObservables();

  return (
    <>
      <Pressable
        onLongPress={() => SET_resetDbModalOpen(!IS_resetDbModalOpen)}
        style={{ backgroundColor: MyColors.fill_bg }}
      >
        <Header title="My vocabs" big={true} />
      </Pressable>

      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <MyRecentLists_FLATLIST
          lists={myTopLists}
          onPress={() => PUSH_router("my-lists")}
          totalList_COUNT={totalUserList_COUNT}
        />
        <VocabPageBigMain_BTNS
          NAVIGATE_toMarkedVocabs={() => PUSH_router("saved-vocabs")}
          NAVIGATE_toAllVocabs={() => PUSH_router("all-my-vocabs")}
          NAVIGATE_toDeletedVocabs={() => PUSH_router("deleted-vocabs")}
          {...{
            totalSavedVocab_COUNT,
            totalUserVocab_COUNT,
            deletedUserVocab_COUNT,
          }}
        />
      </ScrollView>

      <Portal>
        <Confirmation_MODAL
          action={() => {
            (async () => {
              await RESET_database();
              SET_resetDbModalOpen(false);
            })();
          }}
          actionBtnText="Yes, reset"
          open={IS_resetDbModalOpen}
          title="Reset database"
          toggle={() => SET_resetDbModalOpen(!IS_resetDbModalOpen)}
        />
      </Portal>
    </>
  );
}
