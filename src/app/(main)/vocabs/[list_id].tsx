//
//
//

import React, { useEffect, useState } from "react";
import {
  DeleteList_MODAL,
  ListSettings_MODAL,
} from "@/src/features/lists/components";

import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { CreateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Portal } from "@gorhom/portal";
import { USE_modalToggles } from "@/src/hooks/index";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { USE_getListName } from "@/src/features_new/lists/hooks/USE_getListName/USE_getListName";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import USE_controlMyVocabsFetch from "@/src/features_new/vocabs/hooks/fetchControls/USE_controlMyVocabsFetch/USE_controlMyVocabsFetch";
import { MyOneList_NAV } from "@/src/features_new/lists/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import { UpdateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import { USE_vocabs } from "@/src/features_new/vocabs/hooks/USE_vocabs/USE_vocabs";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { Global_EVENTS } from "@/src/mitt/mitt";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export default function SingleList_PAGE() {
  const { urlParamsList_ID } = USE_listIdInParams();
  const { list_NAME } = USE_getListName({ type: "private" });
  const { modals } = USE_modalToggles([
    "createVocab",
    "updateVocab",
    "listSettings",
    "displaySettings",
    "deleteList",
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
    fetch_TYPE: "byTargetList",
    IS_private: true,
    search,
    targetList_ID: urlParamsList_ID,
  });

  const { z_GET_activeFilterCount } = z_USE_myVocabsDisplaySettings();

  return (
    <>
      <MyOneList_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_createVocabModal={() => modals.createVocab.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        SHOW_listName={showTitle}
      />

      <MyVocabs_FLASHLIST
        OPEN_updateVocabModal={() => modals.updateVocab.set(true)}
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        vocabs={vocabs}
        fetch_TYPE={"byTargetList"}
        loading_STATE={loading_STATE}
        error={error}
        highlighted_ID={highlighted_ID || ""}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={list_NAME}
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
