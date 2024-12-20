//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";

import List_MODEL from "@/src/db/models/List_MODEL";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import { CreateList_MODAL, MyLists_FLATLIST } from "@/src/features/1_lists";

import { useTranslation } from "react-i18next";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import RenameList_MODAL from "@/src/features/1_lists/components/RenameList_MODAL/RenameList_MODAL";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import DeleteList_MODAL from "@/src/features/1_lists/components/DeleteList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { FlatList } from "react-native";
import USE_zustand from "@/src/zustand";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import ListsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/ListsFlatlistHeader_SECTION";
import { USE_lists } from "@/src/features/1_lists/hooks/USE_myLists";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_collectMyListLangs from "@/src/features/1_lists/hooks/USE_collectMyListLangs";

import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";

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
  const collectedLang_IDS = USE_collectMyListLangs(z_user);

  const {
    IS_searching,
    data: lists,
    error,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_lists({
    search: debouncedSearch,
    user_id: z_user?.id,
    z_listDisplay_SETTINGS,
    IS_debouncing,
  });

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
        {...{ lists, error, IS_searching }}
        onScroll={handleScroll}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
            list_NAME="My lists"
            totalLists={unpaginated_COUNT}
            HAS_error={error?.value}
            {...{
              search,
              IS_searching,
              z_listDisplay_SETTINGS,
              z_SET_listDisplaySettings,
            }}
          />
        }
        listFooter_EL={
          <BottomAction_SECTION
            type="list"
            createBtn_ACTION={() => TOGGLE_modal("create")}
            totalFilteredResults_COUNT={unpaginated_COUNT}
            RESET_search={() => SET_search("")}
            RESET_filters={() => z_SET_listDisplaySettings({ langFilters: [] })}
            {...{
              search,
              IS_debouncing,
              LOAD_more,
              IS_loadingMore,
              activeFilter_COUNT,
              HAS_reachedEnd,
            }}
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
            type: "success",
            duration: 5000,
          });
        }}
      />
      <RenameList_MODAL
        list={target_LIST}
        user_id={z_user?.id}
        current_NAME={target_LIST?.name}
        IS_open={modal_STATES.rename}
        CLOSE_modal={() => TOGGLE_modal("rename")}
        onSuccess={(updated_LIST?: List_MODEL) => {
          if (updated_LIST) {
            highlight(updated_LIST.id);
            toast.show(t("notifications.listRenamed"), {
              type: "success",
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
            type: "success",
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
