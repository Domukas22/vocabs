//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import React from "react";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import USE_fetchPublicLists from "@/src/features/2_vocabs/hooks/USE_fetchPublicLists";
import USE_zustand from "@/src/zustand";
import ExploreLists_SUBNAV from "@/src/features/1_lists/components/ExploreLists_SUBNAV";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";

import ExploreListsBottom_SECTION from "@/src/features/1_lists/components/ExploreListsBottom_SECTION";
import PublicLists_HEADER from "@/src/features/1_lists/components/PublicLists_HEADER";
import ExploreLists_FLATLIST from "@/src/features/1_lists/components/ExploreLists_FLATLIST";
import ListsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/ListsFlatlistHeader_SECTION";
import USE_totalPublicListCount from "@/src/features/1_lists/hooks/USE_totalPublicListCount";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import { useRouter } from "expo-router";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";

export default function PublicLists_PAGE() {
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
  ]);

  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const { vocab_COUNT, IS_totalCountFetching, fetchTotalCount_ERROR } =
    USE_totalPublicListCount();

  const {
    lists,
    ARE_listsFetching,
    fetchLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
    filteredList_COUNT,
  } = USE_fetchPublicLists({
    search: debouncedSearch,
    z_listDisplay_SETTINGS,
    paginateBy: 2,
  });

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_listDisplay_SETTINGS);
  const router = useRouter();

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="⭐ Public lists"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        IS_searchBig={true}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <ExploreLists_FLATLIST
        type="public"
        {...{
          lists,
          IS_loadingMore,
          HAS_reachedEnd: lists?.length >= filteredList_COUNT,
          ARE_listsFetching,
          LOAD_more,
        }}
        onScroll={handleScroll}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
            list_NAME="⭐ Public lists"
            IS_searching={IS_debouncing || ARE_listsFetching}
            totalLists={vocab_COUNT}
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
              totalFilteredResults_COUNT: filteredList_COUNT,
              HAS_reachedEnd: lists?.length >= filteredList_COUNT,
            }}
            RESET_search={() => SET_search("")}
            RESET_filters={() => z_SET_listDisplaySettings({ langFilters: [] })}
          />
        }
      />

      {/* ------------------------------------------------ MODALS ------------------------------------------------ */}

      <ListDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
      />
    </Page_WRAP>
  );
}
