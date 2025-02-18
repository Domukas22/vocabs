//
//
//

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import {
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";

import React from "react";
import { CreateMyVocab_MODAL } from "@/src/features/vocabs/components/1_myVocabs/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import {
  myVocabFetch_TYPES,
  list_TYPES,
} from "@/src/features_new/vocabs/functions/fetch/FETCH_vocabs/types";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";

const fetch_TYPE: myVocabFetch_TYPES = "all";
const list_TYPE: list_TYPES = "private";

export default function AllVocabs_PAGE() {
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles([
    "createVocab",
    "updateVocab",
    "displaySettings",
  ]);

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_create={() => modals.createVocab.set(true)}
        {...{ search, SET_search }}
      />
      <MyVocabs_FLASHLIST
        OPEN_createVocabModal={() => modals.createVocab.set(true)}
        OPEN_updateVocabModal={() => modals.updateVocab.set(true)}
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
        <CreateMyVocab_MODAL
          IS_open={modals.createVocab.IS_open}
          CLOSE_modal={() => modals.createVocab.set(false)}
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
