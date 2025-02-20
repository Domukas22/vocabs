//
//
//

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import {
  ReviveDeletedVocab_MODAL,
  VocabDisplaySettings_MODAL,
  VocabFlashlist_HEADER,
} from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import USE_controlMyVocabsFetch from "@/src/features_new/vocabs/hooks/fetchVocabs/USE_controlMyVocabsFetch/USE_controlMyVocabsFetch";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/components/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import React from "react";

export default function DeletedVocabs_PAGE() {
  const { modals } = USE_modalToggles([
    "reviveVocab",
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

  // Refetches on filter changes
  const { LOAD_more } = USE_controlMyVocabsFetch({
    search: debouncedSearch,
    fetch_TYPE: "deleted",
    targetList_ID: "",
  });

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME={t("listName.deletedVocabs")}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search }}
      />
      <MyVocabs_FLASHLIST
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <VocabFlashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_myVocabsLoading_STATE}
            list_NAME={t("listName.deletedVocabs")}
            unpaginated_COUNT={z_myVocabsUnpaginated_COUNT}
            HAS_error={!!z_myVocabs_ERROR}
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
        <ReviveDeletedVocab_MODAL
          IS_open={modals.reviveVocab.IS_open}
          CLOSE_modal={() => modals.reviveVocab.set(false)}
        />
        <ListSettings_MODAL
          IS_open={modals.listSettings.IS_open}
          CLOSE_modal={() => modals.listSettings.set(false)}
        />
        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
      </Portal>
    </>
  );
}
