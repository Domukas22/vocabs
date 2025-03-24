//
//
//

import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";
import { ActivityIndicator, View } from "react-native";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";
import { MyColors } from "@/src/constants/MyColors";
import USE_refetchPublicStarterContent from "@/src/hooks/zustand/z_USE_publicStarterContent/USE_refetchPublicStarterContent/USE_refetchPublicStarterContent";
import { z_USE_publicStarterContent } from "@/src/hooks/zustand/z_USE_publicStarterContent/z_USE_publicStarterContent";
import { t } from "i18next";
import { TopPublicVocabs_LIST } from "@/src/features/lists/components/flatlists/TopPublicVocabs_LIST/TopPublicVocabs_LIST";
import { ScrollView } from "react-native-gesture-handler";
import { PopularPublicLists_LIST } from "@/src/features/lists/components/flatlists/PopularPublicLists_LIST/PopularPublicLists_LIST";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { USE_publicStarterContent } from "@/src/hooks/starterContent/USE_publicStarterContent/USE_publicStarterContent";
import { starterContentLoading_TYPE } from "@/src/types/general_TYPES";
import { Portal } from "@gorhom/portal";
import { SaveVocab_MODAL } from "@/src/features_new/vocabs/components/modals/SaveVocab_MODAL/SaveVocab_MODAL";
import { USE_modalToggles } from "@/src/hooks";
import {
  CreateList_MODAL,
  SelectMyList_MODAL,
} from "@/src/features/lists/components";
import { z_USE_myTargetSaveList } from "@/src/features_new/lists/hooks/zustand/z_USE_myTargetSaveList/z_USE_myTargetSaveList";

export default function Explore_PAGE() {
  const {
    top_LISTS,
    top_VOCABS,
    totalList_COUNT,
    totalVocab_COUNT,
    error,
    loading,
  } = USE_publicStarterContent();

  const { modals } = USE_modalToggles(["saveVocab", "selectList"]);
  const { z_myTargetSave_LIST } = z_USE_myTargetSaveList();

  return (
    <>
      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <MainExploreTab_LINKS
          totalList_COUNT={totalList_COUNT}
          totalVocab_COUNT={totalVocab_COUNT}
          loading={loading}
        />
        <View>
          <TopPublicVocabs_LIST
            top_VOCABS={top_VOCABS}
            totalVocab_COUNT={totalVocab_COUNT}
            loading={loading}
            OPEN_saveVocabModal={() => modals.saveVocab.set(true)}
          />
        </View>
        <View
          style={{
            marginBottom: 60,
          }}
        >
          <PopularPublicLists_LIST
            top_LISTS={top_LISTS}
            totalList_COUNT={totalList_COUNT}
            loading={loading}
          />
        </View>
      </ScrollView>

      <Portal>
        <SaveVocab_MODAL
          IS_open={modals.saveVocab.IS_open}
          CLOSE_modal={() => modals.saveVocab.set(false)}
        />
        {/* <SelectMyList_MODAL
                open={modals.chooseList.IS_open}
                title="Choose a list"
                submit_ACTION={(list: TinyList_TYPE) => {
                  if (list) {
                    setValue("list", { id: list?.id, name: list?.name });
                    clearErrors("list");
                 
                    modals.selectList.set(false);
                  }
                }}
                cancel_ACTION={() => modals.selectList.set(false)}
                IS_inAction={false}
                initial_LIST={z_myTargetSave_LIST}
              /> */}
      </Portal>
    </>
  );
}

function MainExploreTab_LINKS({
  totalList_COUNT = 0,
  totalVocab_COUNT = 0,
  loading = "initial",
}: {
  totalList_COUNT: number;
  totalVocab_COUNT: number;
  loading: starterContentLoading_TYPE;
}) {
  const router = useRouter();
  const IS_loading = useMemo(() => loading !== "none", [loading]);

  return (
    <View
      style={{
        padding: 12,
        gap: 12,
        backgroundColor: MyColors.fill_bg,
        flex: 1,
        borderBottomColor: MyColors.border_white_005,
        borderBottomWidth: 1,
      }}
    >
      <Styled_TEXT type="text_22_bold">{t("header.exploreTab")}</Styled_TEXT>
      <BigPage_BTN
        IS_loading={IS_loading}
        title="⭐ Public lists"
        description={`Explore and save any of our ${totalList_COUNT} public lists`}
        onPress={() => router.push("/(main)/explore/public_lists")}
      />
      <BigPage_BTN
        IS_loading={IS_loading}
        title="🔤 All public vocabs"
        description={`Search all ${totalVocab_COUNT} public vocabs in the app`}
        onPress={() => router.push("/(main)/explore/all_public_vocabs")}
      />
    </View>
  );
}
