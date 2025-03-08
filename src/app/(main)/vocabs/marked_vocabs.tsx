//
//
//

// import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import {
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  VocabFlashlist_HEADER,
} from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import React, { useEffect } from "react";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import { vocabFetch_TYPES } from "@/src/features_new/vocabs/functions/FETCH_vocabs/types";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import USE_controlMyVocabsFetch from "@/src/features_new/vocabs/hooks/fetchControls/USE_controlMyVocabsFetch/USE_controlMyVocabsFetch";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { MySavedVocabs_NAV } from "@/src/features_new/vocabs/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";

export default function SavedVocabs_PAGE() {
  const { modals } = USE_modalToggles([
    "updateVocab",
    "displaySettings",
    "listSettings",
  ]);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const {
    z_myVocabsLoading_STATE,
    z_myVocabsUnpaginated_COUNT,
    z_myVocabs_ERROR,
    z_HAVE_myVocabsReachedEnd,
  } = z_USE_myVocabs();

  const { z_myVocabDisplay_SETTINGS } = z_USE_myVocabsDisplaySettings();

  // Refetches on filter changes
  const { LOAD_more } = USE_controlMyVocabsFetch({
    search: debouncedSearch,
    fetch_TYPE: "marked",
    targetList_ID: "",
  });

  return (
    <>
      <MySavedVocabs_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SHOW_listName={showTitle}
      />
      <MyVocabs_FLASHLIST
        OPEN_updateVocabModal={() => modals.updateVocab.set(true)}
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_myVocabsLoading_STATE}
            list_NAME={t("listName.savedVocabs")}
            unpaginated_COUNT={z_myVocabsUnpaginated_COUNT}
            appliedFilter_COUNT={
              (z_myVocabDisplay_SETTINGS?.langFilters?.length || 0) +
              (z_myVocabDisplay_SETTINGS?.difficultyFilters?.length || 0)
            }
            type="my-vocabs"
          />
        }
        Footer={
          <VocabFlatlist_FOOTER
            LOAD_more={LOAD_more}
            RESET_search={RESET_search}
            unpaginated_COUNT={z_myVocabsUnpaginated_COUNT}
            HAS_reachedEnd={z_HAVE_myVocabsReachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={z_myVocabsLoading_STATE}
            debouncedSearch={debouncedSearch}
            error={z_myVocabs_ERROR}
          />
        }
      />

      <Portal>
        <ListSettings_MODAL
          IS_open={modals.listSettings.IS_open}
          CLOSE_modal={() => modals.listSettings.set(false)}
        />
        <UpdateMyVocab_MODAL
          IS_open={modals.updateVocab.IS_open}
          CLOSE_modal={() => modals.updateVocab.set(false)}
        />
        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
      </Portal>
    </>
  );
}
