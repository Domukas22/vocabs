//
//
//

// import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";

import React from "react";
import { CreateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { AllMyVocabs_NAV } from "@/src/features_new/vocabs/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import { USE_vocabs } from "@/src/features_new/vocabs/hooks/USE_vocabs/USE_vocabs";
import { UpdateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";

export default function AllVocabs_PAGE() {
  const { modals } = USE_modalToggles([
    "createVocab",
    "updateVocab",
    "displaySettings",
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
    fetch_TYPE: "all",
    IS_private: true,
    search,
  });

  const { z_GET_activeFilterCount } = z_USE_myVocabsDisplaySettings();

  return (
    <>
      <AllMyVocabs_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_createVocabModal={() => modals.createVocab.set(true)}
        SHOW_listName={showTitle}
      />

      <MyVocabs_FLASHLIST
        OPEN_updateVocabModal={() => modals.updateVocab.set(true)}
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        vocabs={vocabs}
        fetch_TYPE={"all"}
        loading_STATE={loading_STATE}
        error={error}
        highlighted_ID={highlighted_ID}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={t("listName.allMyVocabs")}
            unpaginated_COUNT={unpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="my-vocabs"
          />
        }
        Footer={
          <VocabFlatlist_FOOTER
            LOAD_more={LOAD_more}
            OPEN_createVocabModal={() => modals.createVocab.set(true)}
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
        <CreateMyVocab_MODAL
          IS_open={modals.createVocab.IS_open}
          CLOSE_modal={() => modals.createVocab.set(false)}
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
