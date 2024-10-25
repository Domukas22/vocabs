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

export default function PublicLists_PAGE() {
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_listDisplay_SETTINGS, z_SET_listDisplaySettings } = USE_zustand();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
  ]);

  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const {
    lists,
    ARE_listsFetching,
    fetchLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_fetchPublicLists({
    search: debouncedSearch,
    z_listDisplay_SETTINGS,
    paginateBy: 2,
  });

  return (
    <Page_WRAP>
      <PublicLists_HEADER />

      <ExploreLists_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        {...{ search, SET_search, ARE_langIdsCollecting }}
      />

      <ExploreLists_FLATLIST
        type="public"
        {...{
          lists,
          IS_loadingMore,
          HAS_reachedEnd,
          ARE_listsFetching,
          LOAD_more,
        }}
        listHeader_EL={
          <ListsFlatlistHeader_SECTION
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
