//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import {
  ExploreLists_FLATLIST,
  ListDisplaySettings_MODAL,
  ListsFlatlist_HEADER,
} from "@/src/features/lists/components";
import {
  USE_collectSharedListLangs,
  USE_supabaseLists,
} from "@/src/features/lists/functions";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { USE_showListHeaderTitle, USE_debounceSearch } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { USE_zustand } from "@/src/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo } from "react";

export default function SharedLists_PAGE() {
  const { z_user } = USE_zustand();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("lists");
  const router = useRouter();

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles(["displaySettings"]);

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
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME="🔒 Shared lists"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(false)}
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
          <ListsFlatlist_HEADER
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
          <BottomAction_BLOCK
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
        open={modals.displaySettings.IS_open}
        TOGGLE_open={() => modals.displaySettings.set(false)}
        collectedLang_IDS={collectedLang_IDS}
      />
    </>
  );
}
