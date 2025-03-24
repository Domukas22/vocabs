//
//
//

import React from "react";
import { ListDisplaySettings_MODAL } from "@/src/features/lists/components";
import { USE_showListHeaderTitle, USE_debounceSearch } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import USE_controlPublicListsFetch from "@/src/features_new/lists/hooks/fetchControl/USE_controlPublicListsFetch/USE_controlPublicListsFetch";
import { t } from "i18next";
import PublicLists_FLASHLIST from "@/src/features_new/lists/components/flashlists/PublicLists_FLASHLIST/PublicLists_FLASHLIST";
import { ListFlatlist_FOOTER } from "@/src/features_new/lists/components/flashlists/components/ListFlatlist_FOOTER/ListFlatlist_FOOTER";
import { z_USE_publicLists } from "@/src/features_new/lists/hooks/zustand/z_USE_publicLists/z_USE_publicLists";
import { PublicLists_NAV } from "@/src/features_new/lists/components/navs/PublicLists_NAV/PublicLists_NAV";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_publicListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";
import { Portal } from "@gorhom/portal";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import { SaveVocab_MODAL } from "@/src/features_new/vocabs/components/modals/SaveVocab_MODAL/SaveVocab_MODAL";

export default function PublicLists_PAGE() {
  const { modals } = USE_modalToggles(["displaySettings"]);
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const {
    z_publicListsLoading_STATE,
    z_publicListsUnpaginated_COUNT,
    z_publicLists_ERROR,
    z_HAVE_publicListsReachedEnd,
  } = z_USE_publicLists();

  // Refetches on filter changes
  const { LOAD_more } = USE_controlPublicListsFetch({
    search: debouncedSearch,
    fetch_TYPE: "all",
    targetList_ID: "",
  });

  const { z_GET_activeFilterCount } = z_USE_publicListsDisplaySettings();

  return (
    <>
      <PublicLists_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SHOW_listName={showTitle}
      />
      <PublicLists_FLASHLIST
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_publicListsLoading_STATE}
            list_NAME={t("header.publicLists")}
            unpaginated_COUNT={z_publicListsUnpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="public-lists"
          />
        }
        Footer={
          <ListFlatlist_FOOTER
            LOAD_more={LOAD_more}
            RESET_search={RESET_search}
            unpaginated_COUNT={z_publicListsUnpaginated_COUNT}
            HAS_reachedEnd={z_HAVE_publicListsReachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={z_publicListsLoading_STATE}
            debouncedSearch={debouncedSearch}
            error={z_publicLists_ERROR}
          />
        }
      />

      {/* ------------------------------------------------ MODALS ------------------------------------------------ */}

      <Portal>
        <DisplaySettings_MODAL
          starting_TAB="filter"
          type="public-lists"
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
      </Portal>
    </>
  );
}
