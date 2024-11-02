//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { SplashScreen, useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useRef, useState } from "react";

import { List_MODEL } from "@/src/db/watermelon_MODELS";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import {
  CreateList_MODAL,
  List_SKELETONS,
  EmptyFlatList_BOTTM,
  MyLists_FLATLIST,
  MyLists_HEADER,
  MyLists_SUBNAV,
} from "@/src/features/1_lists";

import { useTranslation } from "react-i18next";
import { USE_searchedLists } from "@/src/features/1_lists/hooks/USE_searchedLists/USE_searchedLists";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import RenameList_MODAL from "@/src/features/1_lists/components/RenameList_MODAL/RenameList_MODAL";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import DeleteList_MODAL from "@/src/features/1_lists/components/DeleteList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { FlatList, View } from "react-native";

import ExplorePage_BTN from "@/src/components/ExplorePage_BTN";
import Header from "@/src/components/Header/Header";
import { withObservables } from "@nozbe/watermelondb/react";
import { Lists_DB, Users_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import Btn, { ShimmerEffect } from "@/src/components/Btn/Btn";
import GET_userId from "@/src/utils/GET_userId";
import USE_zustand from "@/src/zustand";
import { checkUnsyncedChanges, PUSH_changes, sync } from "@/src/db/sync";

function _MyLists_PAGE({
  totalUserList_COUNT = 0,
  totalUserVocab_COUNT = 0,
  markedUserVocab_COUNT = 0,
  deletedUserVocab_COUNT = 0,
}: {
  totalUserList_COUNT: number | undefined;
  totalUserVocab_COUNT: number | undefined;
  markedUserVocab_COUNT: number | undefined;
  deletedUserVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();
  const { SET_selectedList } = USE_selectedList();
  const { z_user } = USE_zustand();

  const router = useRouter();
  const list_REF = useRef<FlatList<any>>(null);
  const toast = useToast();

  const [search, SET_search] = useState("");

  return (
    <Page_WRAP>
      <Header title={`My vocabs`} big={true} />

      <View style={{ gap: 8, padding: 12 }}>
        <Btn
          text="Push changes"
          onPress={PUSH_changes}
          // style={{ width: 200 }}
        />
      </View>

      <View style={{ padding: 12, gap: 12 }}>
        <ExplorePage_BTN
          title="My lists"
          description={`${totalUserList_COUNT} lists`}
          onPress={() => router.push("/(main)/vocabs/lists")}
        />
        <ExplorePage_BTN
          title="All my vocabs"
          description={`${totalUserVocab_COUNT} vocabs in total`}
          onPress={() => router.push("/(main)/vocabs/all_vocabs")}
        />

        <ExplorePage_BTN
          title="Deleted vocabs"
          description={`${deletedUserVocab_COUNT} deleted vocabs`}
          onPress={() => router.push("/(main)/vocabs/deleted_vocabs")}
        />
      </View>
    </Page_WRAP>
  );
}

export default function MyLists_PAGE() {
  const { z_user } = USE_zustand();

  const enhance = withObservables([], () => ({
    totalUserList_COUNT: z_user?.totalList_COUNT,
    totalUserVocab_COUNT: z_user?.totalVocab_COUNT,
    markedUserVocab_COUNT: z_user?.markedVocab_COUNT,
    deletedUserVocab_COUNT: z_user?.deletedVocab_COUNT,
  }));
  const EnhancedPage = enhance(_MyLists_PAGE);

  // Render the enhanced page
  return <EnhancedPage />;
}
