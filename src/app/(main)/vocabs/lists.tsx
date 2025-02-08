//
//
//

import { useRouter } from "expo-router";
import React, { useRef } from "react";
import List_MODEL from "@/src/db/models/List_MODEL";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native";
import { useToast } from "react-native-toast-notifications";
import { Portal } from "@gorhom/portal";

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import VocabList_HEADER from "@/src/components/1_grouped/headers/listPage/VocabList_HEADER";

import {
  USE_highlighedId,
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_modalToggles,
} from "@/src/hooks";

import {
  MyLists_FLATLIST,
  CreateList_MODAL,
  ListDisplaySettings_MODAL,
  ListsFlatlist_HEADER,
} from "@/src/features/lists/components";

import { USE_myLists } from "@/src/features/lists/functions";

export default function MyLists_PAGE() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();

  const { highlighted_ID, highlight } = USE_highlighedId();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { modals } = USE_modalToggles(["createList", "displaySettings"]);
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const list_REF = useRef<FlatList<any>>(null);

  const {
    IS_searching,
    data: lists,
    error,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT,
    LOAD_more,
    ADD_vocabToReducer,
  } = USE_myLists({
    search: debouncedSearch,
    IS_debouncing,
  });

  return (
    <>
      <VocabList_HEADER
        SHOW_listName={showTitle}
        list_NAME={"My Lists"}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.toggle()}
        OPEN_create={() => modals.createList.toggle()}
        {...{ search, SET_search }}
      />

      {/* <Btn text="Existing lists" onPress={() => sync(true)} /> */}
      <MyLists_FLATLIST
        {...{
          lists,
          error,
          search,
          IS_searching,
          unpaginated_COUNT,
          IS_debouncing,
          LOAD_more,
          IS_loadingMore,
          HAS_reachedEnd,
          highlighted_ID,
        }}
        onScroll={handleScroll}
        OPEN_createListModal={() => modals.createList.set(true)}
        RESET_search={() => SET_search("")}
      />
      <Portal>
        <CreateList_MODAL
          IS_open={modals.createList.IS_open}
          currentList_NAMES={[]}
          CLOSE_modal={() => modals.createList.toggle()}
          onSuccess={(newList: List_MODEL) => {
            highlight(newList?.id);
            list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });

            ADD_vocabToReducer(newList);
            toast.show(t("notifications.listCreated"), {
              type: "success",
              duration: 5000,
            });
          }}
        />

        <ListDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.toggle()}
        />
      </Portal>
    </>
  );
}

///-----------------------------------------
