//
//
//

import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import React from "react";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { MySavedVocabs_NAV } from "@/src/features_new/vocabs/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import USE_controlMarkedVocabsFetch from "@/src/features_new/vocabs/hooks/fetchControls/USE_controlMarkedVocabsFetch/USE_controlMarkedVocabsFetch";
import { z_USE_markedVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_markedVocabs/z_USE_markedVocabs";
import { z_USE_markedVocabsSettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_markedVocabsSettings/z_USE_markedVocabsSettings";
import MarkedVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MarkedVocabs_FLASHLIST/MarkedVocabs_FLASHLIST";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import USE_controlMyVocabsFetch from "@/src/features_new/vocabs/hooks/fetchControls/USE_controlMyVocabsFetch/USE_controlMyVocabsFetch";
import { UpdateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import { USE_vocabs } from "@/src/features_new/vocabs/hooks/USE_vocabs/USE_vocabs";

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
    error,
    vocabs,
    lang_IDS,
    loading_STATE,
    highlighted_ID,
    HAS_reachedEnd,
    unpaginated_COUNT,
    refetch,
    LOAD_more,
  } = USE_vocabs({
    fetch_TYPE: "marked",
    IS_private: true,
    search,
  });

  const { z_GET_activeFilterCount } = z_USE_myVocabsDisplaySettings();

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
        vocabs={vocabs}
        fetch_TYPE={"marked"}
        loading_STATE={loading_STATE}
        error={error}
        highlighted_ID={highlighted_ID}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={t("listName.savedVocabs")}
            unpaginated_COUNT={unpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="my-vocabs"
          />
        }
        Footer={
          <VocabFlatlist_FOOTER
            LOAD_more={LOAD_more}
            RESET_search={RESET_search}
            unpaginated_COUNT={unpaginated_COUNT}
            HAS_reachedEnd={HAS_reachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={loading_STATE}
            debouncedSearch={debouncedSearch}
            error={error}
          />
        }
      />

      <Portal>
        <ListSettings_MODAL
          IS_open={modals.listSettings.IS_open}
          CLOSE_modal={() => modals.listSettings.set(false)}
          refetch={refetch}
        />
        <UpdateMyVocab_MODAL
          IS_open={modals.updateVocab.IS_open}
          CLOSE_modal={() => modals.updateVocab.set(false)}
        />
        <DisplaySettings_MODAL
          starting_TAB="vocab-preview"
          type="my-vocabs"
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
      </Portal>
    </>
  );
}
