//
//
//

import React from "react";
import { Portal } from "@gorhom/portal";

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";

import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_modalToggles,
} from "@/src/hooks";

import {
  CreateList_MODAL,
  ListDisplaySettings_MODAL,
  ListsFlatlist_HEADER,
} from "@/src/features/lists/components";
import MyLists_FLASHLIST from "@/src/features_new/lists/components/flashlists/MyLists_FLASHLIST/MyLists_FLASHLIST";
import { t } from "i18next";
import { Keyboard } from "react-native";
import USE_controlMyListsFetch from "@/src/features_new/lists/hooks/fetchLists/USE_controlMyListsFetch/USE_controlMyListsFetch";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { ListFlatlist_FOOTER } from "@/src/features_new/lists/components/flashlists/components/ListFlatlist_FOOTER/ListFlatlist_FOOTER";

export default function MyLists_PAGE() {
  const { modals } = USE_modalToggles(["createList", "displaySettings"]);
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const {
    z_myListsLoading_STATE,
    z_myListsUnpaginated_COUNT,
    z_myLists_ERROR,
    z_HAVE_myListsReachedEnd,
  } = z_USE_myLists();

  // Refetches on filter changes
  const { LOAD_more } = USE_controlMyListsFetch({
    search: debouncedSearch,
    fetch_TYPE: "all",
    targetList_ID: "",
  });

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME={t("header.myLists")}
        OPEN_displaySettings={() => modals.displaySettings.toggle()}
        OPEN_create={() => modals.createList.toggle()}
        {...{ search, SET_search }}
      />

      <MyLists_FLASHLIST
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <ListsFlatlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_myListsLoading_STATE}
            list_NAME={t("header.myLists")}
            unpaginated_COUNT={z_myListsUnpaginated_COUNT}
            HAS_error={!!z_myLists_ERROR}
          />
        }
        Footer={
          <ListFlatlist_FOOTER
            LOAD_more={LOAD_more}
            OPEN_createVocabModal={() => modals.createList.set(true)}
            RESET_search={RESET_search}
            unpaginated_COUNT={z_myListsUnpaginated_COUNT}
            HAS_reachedEnd={z_HAVE_myListsReachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={z_myListsLoading_STATE}
            debouncedSearch={debouncedSearch}
            error={z_myLists_ERROR}
          />
        }
      />

      <Portal>
        <CreateList_MODAL
          IS_open={modals.createList.IS_open}
          currentList_NAMES={[]}
          CLOSE_modal={() => {
            modals.createList.toggle();
            Keyboard.dismiss();
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
