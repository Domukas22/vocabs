//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import React from "react";
import SharedLists_HEADER from "@/src/features/1_lists/components/SharedLists_HEADER";
import USE_fetchSharedSupabaseLists from "@/src/features/2_vocabs/hooks/USE_fetchSharedSupabaseLists";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_zustand from "@/src/zustand";

import USE_collectSharedListLangs from "@/src/features/2_vocabs/hooks/USE_collectSharedListLangs";
import ExploreLists_SUBNAV from "@/src/features/1_lists/components/ExploreLists_SUBNAV";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import ExploreListsBottom_SECTION from "@/src/features/1_lists/components/ExploreListsBottom_SECTION";
import ExploreLists_FLATLIST from "@/src/features/1_lists/components/ExploreLists_FLATLIST";
import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";
import ListsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/ListsFlatlistHeader_SECTION";
import USE_totalPublicListCount from "@/src/features/1_lists/hooks/USE_totalPublicListCount";
import USE_totalSharedListCount from "@/src/features/1_lists/hooks/USE_totalSharedListCount";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import { useRouter } from "expo-router";
import List_HEADER from "@/src/components/Header/List_HEADER";
import Margin_SECTION from "@/src/components/Margin_SECTION";

export default function SharedLists_PAGE() {
  const { z_user } = USE_zustand();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
  ]);

  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectSharedListLangs(z_user?.id);

  const { vocab_COUNT, IS_totalCountFetching, fetchTotalCount_ERROR } =
    USE_totalSharedListCount(z_user?.id);

  const {
    sharedLists,
    ARE_listsFetching,
    sharedLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_fetchSharedSupabaseLists({
    search: debouncedSearch,
    z_listDisplay_SETTINGS,
    user_id: z_user?.id,
    paginateBy: 2,
  });

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_listDisplay_SETTINGS);
  const router = useRouter();

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="🔒 Shared lists"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        IS_searchBig={true}
        {...{ search, SET_search, activeFilter_COUNT }}
      />
      <Margin_SECTION />
      <ExploreLists_FLATLIST
        lists={sharedLists}
        type="shared"
        {...{
          IS_loadingMore,
          HAS_reachedEnd,
          ARE_listsFetching,
          LOAD_more,
        }}
        onScroll={handleScroll}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
            list_NAME="🔒 Shared lists"
            totalLists={vocab_COUNT}
            {...{ search, z_listDisplay_SETTINGS, z_SET_listDisplaySettings }}
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
