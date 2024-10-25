//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import React from "react";
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import USE_fetchPublicSupabaseLists from "@/src/features/2_vocabs/hooks/USE_fetchPublicSupabaseLists";
import USE_zustand from "@/src/zustand";
import PublicLists_SUBNAV from "@/src/features/1_lists/components/PublicLists_SUBNAV";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import ListDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/ListDisplaySettings_MODAL";
import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";

import AllPublicListsBottom_SECTION from "@/src/features/1_lists/components/AllPublicListsBottom_SECTION";
import PublicLists_HEADER from "@/src/features/1_lists/components/PublicLists_HEADER";
import PublisList_FLATLIST from "@/src/features/1_lists/components/PublisList_FLATLIST";

export default function PublicLists_PAGE() {
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_listDisplay_SETTINGS } = USE_zustand();
  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
  ]);

  const {
    publicLists,
    ARE_listsFetching,
    publicLists_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_fetchPublicSupabaseLists({
    search: debouncedSearch,
    z_listDisplay_SETTINGS,
    paginateBy: 2,
  });

  return (
    <Page_WRAP>
      <PublicLists_HEADER />

      <PublicLists_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        {...{ search, SET_search, ARE_langIdsCollecting }}
      />
      <PublisList_FLATLIST
        lists={publicLists}
        bottom_SECTION={
          <AllPublicListsBottom_SECTION
            {...{
              IS_loadingMore,
              HAS_reachedEnd,
              ARE_listsFetching,
              LOAD_more,
            }}
          />
        }
      />

      {/* ------------------------ MODALS --------------------------------- */}

      <ListDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
      />
    </Page_WRAP>
  );
}
