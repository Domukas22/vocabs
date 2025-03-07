//
//
//

import React from "react";

import {
  VocabDisplaySettings_MODAL,
  VocabFlashlist_HEADER,
} from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import PublicVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/PublicVocabs_FLASHLIST/PublicVocabs_FLASHLIST";
import { z_USE_publicVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import USE_controlPublicVocabsFetch from "@/src/features_new/vocabs/hooks/fetchControls/USE_controlPublicVocabsFetch/USE_controlPublicVocabsFetch";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { AllPublicVocabs_NAV } from "@/src/features_new/vocabs/components/navs/AllPublicVocabs_NAV/AllPublicVocabs_NAV";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";

export default function AllPublicVocabs_PAGE() {
  const { modals } = USE_modalToggles(["saveVocab", "displaySettings"]);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const {
    z_publicVocabsLoading_STATE,
    z_publicVocabsUnpaginated_COUNT,
    z_publicVocabs_ERROR,
    z_HAVE_publicVocabsReachedEnd,
  } = z_USE_publicVocabs();

  // Refetches on filter changes
  const { LOAD_more } = USE_controlPublicVocabsFetch({
    search: debouncedSearch,
    fetch_TYPE: "all",
    targetList_ID: "",
  });

  const { z_GET_activeFilterCount } = z_USE_publicVocabsDisplaySettings();

  return (
    <>
      <AllPublicVocabs_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SHOW_listName={showTitle}
      />

      <PublicVocabs_FLASHLIST
        OPEN_copyVocabModal={() => modals.saveVocab.set(true)}
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_publicVocabsLoading_STATE}
            list_NAME={t("listName.allPublicVocabs")}
            unpaginated_COUNT={z_publicVocabsUnpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="public-vocabs"
          />
        }
        Footer={
          <VocabFlatlist_FOOTER
            LOAD_more={LOAD_more}
            RESET_search={RESET_search}
            unpaginated_COUNT={z_publicVocabsUnpaginated_COUNT}
            HAS_reachedEnd={z_HAVE_publicVocabsReachedEnd}
            IS_debouncing={IS_debouncing}
            loading_STATE={z_publicVocabsLoading_STATE}
            debouncedSearch={debouncedSearch}
            error={z_publicVocabs_ERROR}
          />
        }
      />

      <Portal>
        <DisplaySettings_MODAL
          starting_TAB="vocab-preview"
          type="public-vocabs"
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />

        {/* <SavePublicVocabToList_MODAL
          vocab={toCopy_VOCAB}
          IS_open={modals.saveVocab.IS_open}
          onSuccess={() => {
            modals.saveVocab.set(false);
            RESET_targetVocabs();

            toast.show(t("notifications.savedVocab"), {
              type: "success",
              duration: 3000,
            });
          }}
          TOGGLE_open={() => {
            modals.saveVocab.set(false);
            RESET_targetVocabs();
          }}
        /> */}
      </Portal>
    </>
  );
}
