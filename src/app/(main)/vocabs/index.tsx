//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";

import { List_MODEL, User_MODEL } from "@/src/db/watermelon_MODELS";
import React, { useEffect, useState } from "react";

import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Alert, Pressable, View } from "react-native";

import ExplorePage_BTN from "@/src/components/ExplorePage_BTN";
import Header from "@/src/components/Header/Header";
import { withObservables } from "@nozbe/watermelondb/react";
import db from "@/src/db";
import { Q } from "@nozbe/watermelondb";

import USE_zustand from "@/src/zustand";
import { USE_sync } from "@/src/db/USE_sync";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import Btn from "@/src/components/Btn/Btn";
import Block from "@/src/components/Block/Block";
import Label from "@/src/components/Label/Label";
import { ICON_arrow } from "@/src/components/icons/icons";
import { Skeleton } from "@/src/components/Skeleton_VIEW";
import { ScrollView } from "react-native";
import { MyList_BTN } from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import * as SecureStore from "expo-secure-store";
import { supabase } from "@/src/lib/supabase";
import FETCH_mySupabaseProfile from "@/src/features/5_users/utils/FETCH_mySupabaseProfile";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

// export default function Index_PAGE() {
function _Index_PAGE({
  totalUserList_COUNT,
  totalUserVocab_COUNT,
  totalSavedVocab_COUNT,
  deletedUserVocab_COUNT,
  myTopLists,
}: {}) {
  const { z_user, z_SET_user } = USE_zustand();
  const router = useRouter();

  // const {
  //   totalUserList_COUNT,
  //   totalUserVocab_COUNT,
  //   totalSavedVocab_COUNT,
  //   deletedUserVocab_COUNT,
  //   myTopLists,
  // } = USE_userObservables(z_user);

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "resetDB" },
  ]);
  const { logout } = USE_auth();

  async function resetDatabase() {
    TOGGLE_modal("resetDB");
    const { error } = await logout();
    if (error) {
      Alert.alert("Logout error", "Error signing out");
    }
    await db.write(async () => {
      await db.unsafeResetDatabase();
    });

    console.log("🟢 Database has been reset! 🟢");
  }

  const fn = async () => {
    // await logout();
    // await SecureStore.setItemAsync("user_id", "");
    // z_SET_user(undefined);
    // router.push("/welcome");

    z_SET_user(undefined);

    // const { data, error: err2 } = await supabase.from("lists").select("*");
    // if (err2) return console.error(err2);
    // console.log(data);

    // const { supabase_USER, success, msg, error_REASON } =
    //   await FETCH_mySupabaseProfile(z_user?.id);

    // if (!success) {
    //   console.error("error_REASON:", error_REASON);
    //   console.error("msg: ", msg);
    // }
    // console.log(supabase_USER);

    // console.log(z_user?.id);

    // const { data: user, error } = await supabase
    //   .from("users")
    //   .select("*")
    //   .eq("id", z_user?.id)
    //   .single();

    // console.log(user);

    // if (error) console.error(error);
  };

  const { sync: sync_2 } = USE_sync();

  return (
    <Page_WRAP>
      <ScrollView>
        <Pressable onLongPress={() => TOGGLE_modal("resetDB")}>
          <Header title="My lists and vocabs" big={true} />
        </Pressable>

        <View style={{ gap: 8, padding: 12 }}>
          <Btn text="fn" onPress={async () => await fn()} />
        </View>

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

export default function Index_PAGE() {
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

export const USE_userObservables = (user: User_MODEL | undefined) => {
  const [observables, setObservables] = useState({
    totalUserList_COUNT: undefined as number | undefined,
    totalUserVocab_COUNT: undefined as number | undefined,
    totalSavedVocab_COUNT: undefined as number | undefined,
    deletedUserVocab_COUNT: undefined as number | undefined,
    myTopLists: undefined as List_MODEL[] | undefined,
  });

  useEffect(() => {
    if (!user) return;

    const subscriptions = [
      user.totalList_COUNT.subscribe((count) =>
        setObservables((obs) => ({ ...obs, totalUserList_COUNT: count }))
      ),
      user.totalVocab_COUNT.subscribe((count) =>
        setObservables((obs) => ({ ...obs, totalUserVocab_COUNT: count }))
      ),
      user.totalSavedVocab_COUNT.subscribe((count) =>
        setObservables((obs) => ({ ...obs, totalSavedVocab_COUNT: count }))
      ),
      user.deletedVocab_COUNT.subscribe((count) =>
        setObservables((obs) => ({ ...obs, deletedUserVocab_COUNT: count }))
      ),
      // user.myTopLists.observe().subscribe((lists) =>
      //   setObservables((obs) => ({ ...obs, myTopLists: lists }))
      // ),
    ];

    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, [user]);

  return observables;
};
