//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import React, { useEffect } from "react";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";

import ExploreLists_FLATLIST from "@/src/features/1_lists/components/ExploreLists_FLATLIST";
import ListsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/ListsFlatlistHeader_SECTION";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import { useRouter } from "expo-router";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";
import USE_supabaseLists from "@/src/features/1_lists/hooks/USE_supabaseLists";
import USE_pagination from "@/src/hooks/USE_pagination";
import USE_isSearching from "@/src/hooks/USE_isSearching";

export default function PublicLists_PAGE() {
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
    USE_collectPublicListLangs();

  const {
    data,
    error,
    IS_searching,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT,
    LOAD_more,
  } = USE_supabaseLists({
    search: debouncedSearch,
    user_id: z_user?.id,
    z_listDisplay_SETTINGS,
    type: "public",
    IS_debouncing,
  });

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
        IS_searching={IS_searching}
        error={error}
        lists={data}
        onScroll={handleScroll}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
            list_NAME="⭐ Public lists"
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

      {/* ------------------------------------------------ MODALS ------------------------------------------------ */}

      <ListDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
      />
    </Page_WRAP>
  );
}
