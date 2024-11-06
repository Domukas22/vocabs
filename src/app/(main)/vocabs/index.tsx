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

import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { FlatList, Pressable, View } from "react-native";

import ExplorePage_BTN from "@/src/components/ExplorePage_BTN";
import Header from "@/src/components/Header/Header";
import { withObservables } from "@nozbe/watermelondb/react";
import db, { Lists_DB, Users_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";

import GET_userId from "@/src/utils/GET_userId";
import USE_zustand from "@/src/zustand";
import { checkUnsyncedChanges, PUSH_changes, sync } from "@/src/db/sync";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import Btn from "@/src/components/Btn/Btn";
import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import { ICON_arrow } from "@/src/components/icons/icons";
import { Skeleton } from "@/src/components/Skeleton_VIEW";
import { ScrollView } from "react-native";
import { MyList_BTN } from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { USE_logout } from "../general";

function _Index_PAGE({
  totalUserList_COUNT = 0,
  totalUserVocab_COUNT = 0,
  totalSavedVocab_COUNT = 0,
  deletedUserVocab_COUNT = 0,
  myTopLists = [],
}: {
  totalUserList_COUNT: number | undefined;
  totalUserVocab_COUNT: number | undefined;
  totalSavedVocab_COUNT: number | undefined;
  deletedUserVocab_COUNT: number | undefined;
  myTopLists: List_MODEL[] | undefined;
}) {
  const { t } = useTranslation();
  const { SET_selectedList } = USE_selectedList();
  const { z_user } = USE_zustand();

  const router = useRouter();
  const list_REF = useRef<FlatList<any>>(null);
  const toast = useToast();

  const [search, SET_search] = useState("");

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "resetDB" },
  ]);

  const { logout } = USE_logout();

  async function resetDatabase() {
    TOGGLE_modal("resetDB");
    await logout();
    await db.write(async () => {
      await db.unsafeResetDatabase();
    });

    console.log("🟢 Database has been reset! 🟢");
  }

  // const [lists, SET_lists] = useState<List_MODEL[] | undefined>();

  // useEffect(() => {
  //   (async () => {
  //     const result = await Lists_DB.query(
  //       Q.where("user_id", z_user?.id || ""),
  //       Q.where("deleted_at", null),
  //       Q.take(3)
  //     );
  //     SET_lists(result || []);
  //   })();
  // }, []);

  return (
    <Page_WRAP>
      <ScrollView>
        <Pressable onLongPress={() => TOGGLE_modal("resetDB")}>
          <Header title="My lists and vocabs" big={true} />
        </Pressable>

        {/* <View style={{ gap: 8, padding: 12 }}>
    
        <Btn text="Push" onPress={PUSH_changes} />
        <Btn text="Pull" onPress={() => sync("updates", z_user?.id)} />
        <Btn text="Sync all" onPress={() => sync("all", z_user?.id)} />
      </View> */}

        <Block styles={{ gap: 12 }}>
          <Label>My recent lists</Label>
          {myTopLists ? (
            myTopLists?.map((list) => (
              <MyList_BTN
                {...{ list }}
                key={list.id}
                onPress={() => router.push(`/(main)/vocabs/${list.id}`)}
              />
            ))
          ) : (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </>
          )}
          <Btn
            text={`See all ${totalUserList_COUNT} lists`}
            iconRight={<ICON_arrow direction="right" />}
            text_STYLES={{ flex: 1 }}
            onPress={() => router.push("/(main)/vocabs/lists")}
          />
        </Block>

        <View style={{ padding: 12, gap: 12, paddingBottom: 36 }}>
          <Label>My vocabs</Label>

          <ExplorePage_BTN
            title="⭐ Saved vocabs"
            description={`${totalSavedVocab_COUNT} vocabs saved`}
            onPress={() => router.push("/(main)/vocabs/marked_vocabs")}
          />
          <ExplorePage_BTN
            title="🅿️ All my vocabs"
            description={`${totalUserVocab_COUNT} vocabs in total`}
            onPress={() => router.push("/(main)/vocabs/all_vocabs")}
          />

          <ExplorePage_BTN
            title="🗑️ Deleted vocabs"
            description={`${deletedUserVocab_COUNT} deleted vocabs`}
            onPress={() => router.push("/(main)/vocabs/deleted_vocabs")}
          />
        </View>
      </ScrollView>

      <Confirmation_MODAL
        action={resetDatabase}
        actionBtnText="Yes, reset"
        open={modal_STATES.resetDB}
        title="Reset database"
        toggle={() => TOGGLE_modal("resetDB")}
      />
    </Page_WRAP>
  );
}

export default function MyLists_PAGE() {
  const { z_user } = USE_zustand();

  const enhance = withObservables([], () => ({
    totalUserList_COUNT: z_user?.totalList_COUNT,
    totalUserVocab_COUNT: z_user?.totalVocab_COUNT,
    totalSavedVocab_COUNT: z_user?.totalSavedVocab_COUNT,
    markedUserVocab_COUNT: z_user?.markedVocab_COUNT,
    deletedUserVocab_COUNT: z_user?.deletedVocab_COUNT,
    myTopLists: z_user?.myTopLists,
  }));
  const EnhancedPage = enhance(_Index_PAGE);

  // Render the enhanced page
  return <EnhancedPage />;
}
