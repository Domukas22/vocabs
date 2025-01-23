//
//
//

import React, { useMemo } from "react";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import List_HEADER from "@/src/components/1_grouped/headers/listPage/List_HEADER";
import {
  ExploreLists_FLATLIST,
  ListDisplaySettings_MODAL,
  ListsFlatlist_HEADER,
} from "@/src/features/lists/components";
import {
  USE_collectPublicListLangs,
  USE_supabaseLists,
} from "@/src/features/lists/functions";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { USE_showListHeaderTitle, USE_debounceSearch } from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { useRouter } from "expo-router";
import { USE_modalToggles } from "@/src/hooks/index";

export default function PublicLists_PAGE() {
  const { z_user } = USE_zustand();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("lists");
  const router = useRouter();

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles(["displaySettings"]);

  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const {
    data,
    error,
    IS_loading,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT,
    LOAD_more,
  } = USE_supabaseLists({
    search: debouncedSearch,
    user_id: z_user?.id,
    z_listDisplay_SETTINGS,
    type: "public",
  });

  // const IS_searching = USE_isSearching({
  //   IS_fetching: IS_loading,
  //   IS_debouncing,
  //   IS_loadingMore: IS_loadingMore,
  // });

  const IS_searching = useMemo(
    () => (IS_loading || IS_debouncing) && !IS_loadingMore,
    [IS_loading, IS_loadingMore, IS_debouncing]
  );

  // console.log("IS_searching", (IS_loading || IS_debouncing) && !IS_loadingMore);
  // console.log("IS_loadingMore", IS_loadingMore);
  return (
    <>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="⭐ Public lists"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
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
          <ListsFlatlist_HEADER
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
          <BottomAction_BLOCK
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
        open={modals.displaySettings.IS_open}
        TOGGLE_open={() => modals.displaySettings.set(false)}
        collectedLang_IDS={collectedLang_IDS}
      />
    </>
  );
}
