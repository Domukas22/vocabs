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
import { ICON_arrow } from "@/src/components/icons/icons";

export default function MyLists_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();

  const router = useRouter();
  const list_REF = useRef<FlatList<any>>(null);
  const toast = useToast();

  const { highlighted_ID, highlight } = USE_highlighedId();

  return (
    <Page_WRAP>
      <Header title={`Explore lists and vocabs`} big={true} />

      <View style={{ padding: 12, gap: 12 }}>
        {/* -------------------------------- */}

        <Transition_BTN
          onPress={() => router.push("/(main)/explore/public_lists")}
        >
          <Styled_TEXT type="text_18_bold">📁 Public lists</Styled_TEXT>
          <Styled_TEXT type="label_small">
            Choose and save a list you like
          </Styled_TEXT>
          <ICON_arrow direction="right" style={{ alignItems: "flex-end" }} />
        </Transition_BTN>

        <Transition_BTN
          onPress={() => router.push("/(main)/explore/public_vocabs")}
        >
          <Styled_TEXT type="text_18_bold">🔤 All public vocabs</Styled_TEXT>
          <Styled_TEXT type="label_small">
            Search all public vocabs in the app
          </Styled_TEXT>
          <ICON_arrow direction="right" style={{ alignItems: "flex-end" }} />
        </Transition_BTN>
        <Transition_BTN
          onPress={() => router.push("/(main)/explore/shared_lists")}
        >
          <Styled_TEXT type="text_18_bold">🔒 Shared lists</Styled_TEXT>
          <Styled_TEXT type="label_small">
            Find a list your friend created
          </Styled_TEXT>
          <ICON_arrow direction="right" style={{ alignItems: "flex-end" }} />
        </Transition_BTN>

        {/* -------------------------------- */}
      </View>
    </Page_WRAP>
  );
}
