//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import React, { useEffect, useMemo } from "react";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_zustand from "@/src/zustand";

import USE_collectSharedListLangs from "@/src/features/2_vocabs/hooks/USE_collectSharedListLangs";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import ExploreLists_FLATLIST from "@/src/features/1_lists/components/ExploreLists_FLATLIST";
import ListsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/ListsFlatlistHeader_SECTION";

import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import { useRouter } from "expo-router";
import List_HEADER from "@/src/components/Header/List_HEADER";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";
import USE_supabaseLists from "@/src/features/1_lists/hooks/USE_supabaseLists";
import USE_pagination from "@/src/hooks/USE_pagination";
import USE_isSearching from "@/src/hooks/USE_isSearching";

export default function SharedLists_PAGE() {
  const { z_user } = USE_zustand();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_listDisplay_SETTINGS);
  const router = useRouter();

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
  ]);

  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectSharedListLangs(z_user?.id);

  const {
    lists,
    error,
    IS_loading,
    IS_loadingMore,
    unpaginated_COUNT,
    LOAD_more,
  } = USE_supabaseLists({
    search: debouncedSearch,
    user_id: z_user?.id,
    z_listDisplay_SETTINGS,
    type: "shared",
  });

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

      <ExploreLists_FLATLIST
        {...{ lists }}
        type="shared"
        IS_searching={IS_loading || IS_debouncing}
        error={error}
        onScroll={handleScroll}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
            list_NAME="🔒 Shared lists"
            totalLists={unpaginated_COUNT}
            HAS_error={error?.value}
            IS_searching={IS_loading || IS_debouncing}
            {...{
              search,
              z_listDisplay_SETTINGS,
              z_SET_listDisplaySettings,
            }}
          />
        }
        listFooter_EL={
          <BottomAction_SECTION
            type="list"
            totalFilteredResults_COUNT={unpaginated_COUNT}
            RESET_search={() => SET_search("")}
            RESET_filters={() => z_SET_listDisplaySettings({ langFilters: [] })}
            HAS_reachedEnd={lists?.length >= unpaginated_COUNT}
            {...{
              search,
              IS_debouncing,
              LOAD_more,
              IS_loadingMore,
              activeFilter_COUNT,
            }}
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
