//
//
//

import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import Header from "@/src/components/1_grouped/headers/regular/Header";
import BigPage_BTN from "@/src/components/1_grouped/buttons/BigPage_BTN/BigPage_BTN";
import { MyColors } from "@/src/constants/MyColors";
import USE_refetchPublicStarterContent from "@/src/hooks/zustand/z_USE_publicStarterContent/USE_refetchPublicStarterContent/USE_refetchPublicStarterContent";
import { z_USE_publicStarterContent } from "@/src/hooks/zustand/z_USE_publicStarterContent/z_USE_publicStarterContent";
import { t } from "i18next";
import { Top5PublicVocabs_LIST } from "@/src/features/lists/components/flatlists/Top5PublicVocabs_LIST/Top5PublicVocabs_LIST";
import { ScrollView } from "react-native-gesture-handler";
import { PopularPublicLists_LIST } from "@/src/features/lists/components/flatlists/PopularPublicLists_LIST/PopularPublicLists_LIST";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export default function Explore_PAGE() {
  const { z_IS_publicStarterContentRefetching } = z_USE_publicStarterContent();
  const { REFETCH_publicStarterContent } = USE_refetchPublicStarterContent();

  useEffect(() => {
    REFETCH_publicStarterContent(true);
  }, []);

  return (
    <>
      <ScrollView style={{ backgroundColor: MyColors.fill_bg }}>
        <MainExploreTab_LINKS />
        <View style={{}}>
          <Top5PublicVocabs_LIST />
        </View>
        <View
          style={{
            marginBottom: 60,
          }}
        >
          <PopularPublicLists_LIST />
        </View>
      </ScrollView>
    </>
  );
}

function MainExploreTab_LINKS() {
  const router = useRouter();
  const {
    z_IS_publicStarterContentRefetching,
    z_publicStarterTotalVocabCount,
    z_publicStarterTotalListCount,
  } = z_USE_publicStarterContent();

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
        IS_loading={z_IS_publicStarterContentRefetching}
        title="⭐ Public lists"
        description={`Explore and save any of our ${
          z_publicStarterTotalListCount || 0
        } public lists`}
        onPress={() => router.push("/(main)/explore/public_lists")}
      />
      <BigPage_BTN
        IS_loading={z_IS_publicStarterContentRefetching}
        title="🔤 All public vocabs"
        description={`Search all ${
          z_publicStarterTotalVocabCount || 0
        } public vocabs in the app`}
        onPress={() => router.push("/(main)/explore/all_public_vocabs")}
      />
    </View>
  );
}
