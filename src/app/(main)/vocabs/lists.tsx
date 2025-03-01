//
//
//

import React, { useEffect } from "react";
import { Portal } from "@gorhom/portal";

import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_modalToggles,
} from "@/src/hooks";

import {
  CreateList_MODAL,
  ListDisplaySettings_MODAL,
} from "@/src/features/lists/components";
import MyLists_FLASHLIST from "@/src/features_new/lists/components/flashlists/MyLists_FLASHLIST/MyLists_FLASHLIST";
import { t } from "i18next";
import { Keyboard } from "react-native";
import USE_controlMyListsFetch from "@/src/features_new/lists/hooks/fetchControl/USE_controlMyListsFetch/USE_controlMyListsFetch";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { ListFlatlist_FOOTER } from "@/src/features_new/lists/components/flashlists/components/ListFlatlist_FOOTER/ListFlatlist_FOOTER";

import { MyLists_NAV } from "@/src/features_new/lists/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";

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

  const { z_GET_activeFilterCount } = z_USE_myListsDisplaySettings();

  // Refetches on filter changes
  const { LOAD_more } = USE_controlMyListsFetch({
    search: debouncedSearch,
    fetch_TYPE: "all",
    targetList_ID: "",
  });

  return (
    <>
      <MyLists_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_createListModal={() => modals.createList.set(true)}
        SHOW_listName={showTitle}
      />

      <MyLists_FLASHLIST
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_myListsLoading_STATE}
            list_NAME={t("header.myLists")}
            unpaginated_COUNT={z_myListsUnpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="my-lists"
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
          CLOSE_modal={() => {
            modals.createList.toggle();
            Keyboard.dismiss();
          }}
        />
        <DisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.toggle()}
          starting_TAB="filter"
          type="my-lists"
        />
      </Portal>
    </>
  );
}

///-----------------------------------------
