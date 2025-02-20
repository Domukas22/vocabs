//
//
//

import React from "react";

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";

import {
  VocabDisplaySettings_MODAL,
  VocabFlashlist_HEADER,
} from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import PublicVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/PublicVocabs_FLASHLIST/PublicVocabs_FLASHLIST";
import { z_USE_publicVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import USE_controlPublicVocabsFetch from "@/src/features_new/vocabs/hooks/fetchVocabs/USE_controlPublicVocabsFetch/USE_controlPublicVocabsFetch";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/components/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";

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

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME={t("listName.allPublicVocabs")}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search }}
      />
      <PublicVocabs_FLASHLIST
        OPEN_copyVocabModal={() => modals.saveVocab.set(true)}
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <VocabFlashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_publicVocabsLoading_STATE}
            list_NAME={t("listName.allPublicVocabs")}
            unpaginated_COUNT={z_publicVocabsUnpaginated_COUNT}
            HAS_error={!!z_publicVocabs_ERROR}
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
        <VocabDisplaySettings_MODAL
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
