//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
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

import USE_zustand from "@/src/zustand";
import { useTranslation } from "react-i18next";
import { USE_searchedLists } from "@/src/features/1_lists/hooks/USE_searchedLists/USE_searchedLists";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import RenameList_MODAL from "@/src/features/1_lists/components/RenameList_MODAL/RenameList_MODAL";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import DeleteList_MODAL from "@/src/features/1_lists/components/DeleteList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Lists_DB, Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { USER_ID } from "@/src/constants/globalVars";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";
import VocabDifficulty_COUNTS from "@/src/features/1_lists/components/VocabDifficulty_COUNTS/VocabDifficulty_COUNTS";

import { MyColors } from "@/src/constants/MyColors";

import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { ICON_arrow, ICON_difficultyDot } from "@/src/components/icons/icons";
import USE_fetchPublicLists from "@/src/features/2_vocabs/hooks/USE_fetchPublicLists";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import USE_fetchSharedLists from "@/src/features/2_vocabs/hooks/USE_fetchSharedLists";

export default function SharedLists_PAGE() {
  const { user } = USE_auth();

  const router = useRouter();

  const { highlighted_ID, highlight } = USE_highlighedId();

  const { FETCH_sharedLists, ARE_sharedListsFetching, sharedLists_ERROR } =
    USE_fetchSharedLists();

  const [lists, SET_lists] = useState<List_MODEL[]>([]);

  const GET_lists = async () => {
    const lists = await FETCH_sharedLists(user?.id || "");
    if (lists?.success && lists.data) {
      SET_lists(lists.data);
    }
  };

  useEffect(() => {
    GET_lists();
  }, []);

  return (
    <Page_WRAP>
      <Header
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow direction="left" />}
            style={{ borderRadius: 100 }}
            onPress={() => router.back()}
          />
        }
        btnRight={
          <Btn
            iconLeft={<ICON_arrow direction="left" />}
            style={{ opacity: 0, pointerEvents: "none" }}
          />
        }
        title="🔒 Shared lists"
      />

      <Styled_FLATLIST
        data={lists}
        ListHeaderComponent={
          <Styled_TEXT
            type="text_22_bold"
            style={{ marginTop: 4, marginBottom: 16 }}
          >
            Lists shared with you
          </Styled_TEXT>
        }
        renderItem={({ item }) => {
          console.log("🟢🟢", item);

          return (
            <Transition_BTN
              onPress={() =>
                router.push(`/(main)/explore/shared_lists/${item.id}`)
              }
            >
              {item.name && (
                <Styled_TEXT type="text_18_bold">{item.name}</Styled_TEXT>
              )}
              {item.description && (
                <Styled_TEXT type="label_small">{item.description}</Styled_TEXT>
              )}
              {item.owner && item.owner.username && (
                <Styled_TEXT type="label_small">
                  Created by: {item.owner.username}
                </Styled_TEXT>
              )}
              {item.vocab_COUNT && (
                <Styled_TEXT
                  type="text_15_bold"
                  style={{ color: MyColors.text_primary, textAlign: "right" }}
                >
                  {item.vocab_COUNT} vocabs
                </Styled_TEXT>
              )}
            </Transition_BTN>
          );
        }}
        keyExtractor={(item) => "PublicVocab" + item.id}
      />
    </Page_WRAP>
  );
}
