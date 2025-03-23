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
import { USE_lists } from "@/src/features_new/lists/hooks/USE_lists/USE_lists";
import { listFetch_TYPES } from "@/src/features_new/lists/functions/fetch/FETCH_lists/types";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";

const fetch_TYPE: listFetch_TYPES = "all";

export default function MyLists_PAGE() {
  const { modals } = USE_modalToggles(["createList", "displaySettings"]);
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const { filters, sorting, z_GET_activeFilterCount } =
    z_USE_myListsDisplaySettings();
  const { z_user } = z_USE_user();

  const {
    error,
    lists,
    lang_IDS,
    loading_STATE,
    highlighted_ID,
    HAS_reachedEnd,
    unpaginated_COUNT,
    LOAD_more,
  } = USE_lists({
    fetch_TYPE,
    IS_private: true,
    search,
    targetList_ID: "",
    filters,
    sorting,
    user: z_user,
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
        lists={lists}
        fetch_TYPE={fetch_TYPE}
        loading_STATE={loading_STATE}
        error={error}
        highlighted_ID={highlighted_ID || ""}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={t("header.myLists")}
            unpaginated_COUNT={unpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="my-lists"
          />
        }
        Footer={
          <ListFlatlist_FOOTER
            LOAD_more={LOAD_more}
            OPEN_createVocabModal={() => modals.createList.set(true)}
            RESET_search={RESET_search}
            unpaginated_COUNT={unpaginated_COUNT}
            HAS_reachedEnd={HAS_reachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={loading_STATE}
            debouncedSearch={debouncedSearch}
            error={error}
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
