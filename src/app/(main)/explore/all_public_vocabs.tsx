//
//
//

import React from "react";

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";

import { VocabDisplaySettings_MODAL } from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import {
  vocabFetch_TYPES,
  list_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { Portal } from "@gorhom/portal";
import MyVocabs_FLASHLIST from "@/src/features/vocabs/Vocabs_FLASHLIST/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import PublicVocabs_FLASHLIST from "@/src/features/vocabs/Vocabs_FLASHLIST/PublicVocabs_FLASHLIST/PublicVocabs_FLASHLIST";

const fetch_TYPE: vocabFetch_TYPES = "all";
const list_TYPE: list_TYPES = "public";

export default function AllPublicVocabs_PAGE() {
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles(["saveVocab", "displaySettings"]);

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search }}
      />
      <PublicVocabs_FLASHLIST
        RESET_search={() => SET_search("")}
        {...{
          IS_debouncing,
          search,
          debouncedSearch,
          list_TYPE,
          fetch_TYPE,
          handleScroll,
        }}
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
