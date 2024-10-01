//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useMemo, useRef, useState } from "react";

import { List_MODEL } from "@/src/db/models";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import {
  CreateList_MODAL,
  List_SKELETONS,
  EmptyFlatList_BOTTM,
  MyLists_FLATLIST,
  MyLists_HEADER,
  MyLists_SUBNAV,
  FETCH_myLists,
} from "@/src/features/1_lists";

import { Button, View } from "react-native";

import USE_zustand from "@/src/zustand";
import { useTranslation } from "react-i18next";
import { USE_searchedLists } from "@/src/features/1_lists/hooks/USE_searchedLists/USE_searchedLists";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import Btn from "@/src/components/Btn/Btn";

export default function MyLists_PAGE() {
  const router = useRouter();
  const [SHOW_createListModal, TOGGLE_createListModal] = USE_toggle(false);
  const { SET_selectedList } = USE_selectedList();
  const { user } = USE_auth();

  const { t } = useTranslation();
  const list_REF = useRef(null);

  const {
    z_lists,
    z_ARE_listsLoading,
    z_SET_lists,
    z_SET_listsLoading,
    z_SET_listsError,
  } = USE_zustand();

  const { searched_LISTS, search, SEARCH_lists, ARE_listsSearching } =
    USE_searchedLists(z_lists);

  const { highlighted_ID, highlight } = USE_highlighedId();
  // const highlighted_ID = "4a1cd271-cbf4-4134-a72f-78ba71a7cf03";

  useEffect(() => {
    (async () =>
      FETCH_myLists({
        user_id: user?.id,
        z: {
          z_SET_lists,
          z_SET_listsLoading,
          z_SET_listsError,
        },
      }))();
  }, []);

  return (
    <Page_WRAP>
      <MyLists_HEADER {...{ TOGGLE_createListModal }} />

      {z_lists.length > 5 && (
        <MyLists_SUBNAV {...{ search, SET_search: SEARCH_lists }} />
      )}
      {z_ARE_listsLoading || ARE_listsSearching ? <List_SKELETONS /> : null}
      {!z_ARE_listsLoading &&
      !ARE_listsSearching &&
      searched_LISTS.length > 0 ? (
        <MyLists_FLATLIST
          lists={searched_LISTS}
          SELECT_list={(list: List_MODEL) => {
            SET_selectedList(list);
            router.push("/(main)/vocabs/list");
          }}
          SHOW_bottomBtn={search === ""}
          TOGGLE_createListModal={TOGGLE_createListModal}
          highlighted_ID={highlighted_ID}
          _ref={list_REF}
        />
      ) : !z_ARE_listsLoading ? (
        <EmptyFlatList_BOTTM
          emptyBox_TEXT={
            search === ""
              ? t("label.youDontHaveAnyLists")
              : t("label.noListsFound")
          }
          btn_TEXT={t("btn.createList")}
          btn_ACTION={TOGGLE_createListModal}
        />
      ) : null}
      <CreateList_MODAL
        open={SHOW_createListModal}
        toggle={TOGGLE_createListModal}
        highlight={highlight}
        postCreatiion_FNS={() => {
          list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
        }}
      />
    </Page_WRAP>
  );
}
