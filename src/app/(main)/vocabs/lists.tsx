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
import { FlatList, Keyboard } from "react-native";
import { Lists_DB, Users_DB } from "@/src/db";
import GET_userId from "@/src/utils/GET_userId";
import Btn from "@/src/components/Btn/Btn";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import USE_zustand from "@/src/zustand";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import ListsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/ListsFlatlistHeader_SECTION";
import USE_myLists from "@/src/features/1_lists/hooks/USE_myLists";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_collectMyListLangs from "@/src/features/1_lists/hooks/USE_collectMyListLangs";
import { sync } from "@/src/db/sync";

import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";
import { Q } from "@nozbe/watermelondb";

export default function MyLists_PAGE() {
  const { z_user } = USE_zustand();

  const { t } = useTranslation();
  const { SET_selectedList } = USE_selectedList();

  const router = useRouter();
  const list_REF = useRef<FlatList<any>>(null);
  const toast = useToast();

  const { highlighted_ID, highlight } = USE_highlighedId();
  const [target_LIST, SET_targetList] = useState<List_MODEL | undefined>(
    undefined
  );

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "create", initialValue: false },
    { name: "rename", initialValue: false },
    { name: "delete", initialValue: false },
    { name: "displaySettings", initialValue: false },
  ]);

  function PREPARE_listRename(list: List_MODEL) {
    SET_targetList(list);
    TOGGLE_modal("rename");
  }
  function PREPADE_deleteList(list: List_MODEL) {
    SET_targetList(list);
    TOGGLE_modal("delete");
  }
  const activeFilter_COUNT = USE_getActiveFilterCount(z_listDisplay_SETTINGS);

  const {
    lists,
    IS_loadingMore,
    HAS_reachedEnd,
    fetchLists_ERROR,
    ARE_listsFetching,
    totalFilteredLists_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_myLists({
    search: debouncedSearch,
    user_id: z_user?.id,
    z_listDisplay_SETTINGS,
    paginateBy: 10,
  });

  const collectedLang_IDS = USE_collectMyListLangs(z_user);

  const [printed_LISTS, SET_printedLists] = useState<List_MODEL[]>([]);

  useEffect(() => {
    if (!ARE_listsFetching && !IS_loadingMore) {
      SET_printedLists(lists);
      return;
    }
    SET_printedLists(printed_LISTS);
  }, [search, IS_debouncing, ARE_listsFetching, IS_loadingMore, lists]);

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME={"My Lists"}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        OPEN_create={() => TOGGLE_modal("create")}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      {/* <Btn text="Existing lists" onPress={() => sync(true)} /> */}
      <MyLists_FLATLIST
        lists={printed_LISTS}
        SELECT_list={(id: string) => {
          router.push(`/(main)/vocabs/${id}`);
          Keyboard.dismiss();
        }}
        SHOW_bottomBtn={search === ""}
        TOGGLE_createListModal={() => TOGGLE_modal("create")}
        highlighted_ID={highlighted_ID}
        _ref={list_REF}
        PREPARE_listRename={PREPARE_listRename}
        PREPADE_deleteList={PREPADE_deleteList}
        onScroll={handleScroll}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
            list_NAME="My Lists"
            IS_searching={IS_debouncing || ARE_listsFetching}
            totalLists={totalFilteredLists_COUNT}
            {...{ search, z_listDisplay_SETTINGS, z_SET_listDisplaySettings }}
          />
        }
        listFooter_EL={
          <BottomAction_SECTION
            {...{
              search,
              LOAD_more,
              IS_loadingMore,

              activeFilter_COUNT,
              totalFilteredResults_COUNT: totalFilteredLists_COUNT,
              HAS_reachedEnd,
            }}
            type="lists"
            RESET_search={() => SET_search("")}
            RESET_filters={() =>
              z_SET_listDisplaySettings({
                langFilters: [],
              })
            }
          />
        }
      />

      <CreateList_MODAL
        user_id={z_user?.id}
        IS_open={modal_STATES.create}
        currentList_NAMES={[]}
        CLOSE_modal={() => TOGGLE_modal("create")}
        onSuccess={(newList: List_MODEL) => {
          highlight(newList?.id);
          list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
          ADD_toDisplayed(newList);
          toast.show(t("notifications.listCreated"), {
            type: "green",
            duration: 5000,
          });
        }}
      />
      <RenameList_MODAL
        list_id={target_LIST?.id}
        user_id={z_user?.id}
        current_NAME={target_LIST?.name}
        IS_open={modal_STATES.rename}
        CLOSE_modal={() => TOGGLE_modal("rename")}
        onSuccess={(updated_LIST?: List_MODEL) => {
          if (updated_LIST) {
            highlight(updated_LIST.id);
            toast.show(t("notifications.listRenamed"), {
              type: "green",
              duration: 5000,
            });
          }
        }}
      />
      <DeleteList_MODAL
        IS_open={modal_STATES.delete}
        list={target_LIST}
        CLOSE_modal={() => TOGGLE_modal("delete")}
        onSuccess={() => {
          REMOVE_fromDisplayed(target_LIST?.id || "");
          SET_targetList(undefined);
          TOGGLE_modal("delete");
          toast.show(t("notifications.listDeleted"), {
            type: "green",
            duration: 5000,
          });
        }}
      />
      <ListDisplaySettings_MODAL
        open={modal_STATES.displaySettings || false}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS || []}
      />
    </Page_WRAP>
  );
}

///-----------------------------------------
