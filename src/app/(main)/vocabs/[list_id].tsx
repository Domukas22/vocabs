//
//
//

import React, { useCallback, useEffect, useState } from "react";
import { ListSettings_MODAL } from "@/src/features/lists/components";

import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_toggle,
} from "@/src/hooks";
import { CreateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Portal } from "@gorhom/portal";
import { USE_modalToggles } from "@/src/hooks/index";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { USE_getListName } from "@/src/features_new/lists/hooks/USE_getListName/USE_getListName";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { MyOneList_NAV } from "@/src/features_new/lists/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import { UpdateMyVocab_MODAL } from "@/src/features_new/vocabs/components/modals/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import { USE_vocabs } from "@/src/features_new/vocabs/hooks/USE_vocabs/USE_vocabs";
import { List_EVENTS } from "@/src/mitt/mitt";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { List_TYPE } from "@/src/features_new/lists/types";
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

  const { filters, sorting, z_GET_activeFilterCount } =
    z_USE_myVocabsDisplaySettings();
  const { z_user } = z_USE_user();

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const { z_SET_myOneList, z_myOneList } = z_USE_myOneList();

  useEffect(() => {
    const handler = (list: List_TYPE) =>
      list?.id === z_myOneList?.id ? z_SET_myOneList(list) : null;
    List_EVENTS.on("updated", handler);

    return () => {
      List_EVENTS.off("updated", handler);
    };
  }, []);

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
    filters,
    sorting,
    user: z_user,
  });

  const [selected_VOCABS, SET_selectedVocabs] = useState<
    Map<string, Vocab_TYPE>
  >(new Map());

  const HANDLE_vocabSelection = useCallback(
    (id: string, vocab: Vocab_TYPE) => {
      SET_selectedVocabs((prev) => {
        const newMap = new Map(prev);
        if (newMap.has(id)) {
          newMap.delete(id); // Remove if already selected
        } else {
          newMap.set(id, vocab); // Add if not selected
        }
        return newMap;
      });
    },
    [selected_VOCABS, SET_selectedVocabs]
  );

  const SELECT_all = useCallback(
    (vocabs: Map<string, Vocab_TYPE>) => {
      SET_selectedVocabs(new Map(vocabs));
    },
    [SET_selectedVocabs]
  );

  const UNSELECT_all = useCallback(() => {
    SET_selectedVocabs(new Map());
  }, [SET_selectedVocabs]);

  const [
    IS_vocabSelectionOn,
    TOGGLE_isVocabSelectionOn,
    SET_isVocabSelectionOn,
  ] = USE_toggle(false);

  const CANCEL_selection = useCallback(() => {
    SET_selectedVocabs(new Map());
    SET_isVocabSelectionOn(false);
  }, []);

  const TOGGLE_vocabSelection = useCallback(() => {
    SET_selectedVocabs(new Map());
    TOGGLE_isVocabSelectionOn();
  }, [TOGGLE_isVocabSelectionOn, SET_selectedVocabs]);

  return (
    <>
      <MyOneList_NAV
        search={search}
        SET_search={SET_search}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_createVocabModal={() => modals.createVocab.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        SHOW_listName={showTitle}
        IS_vocabSelectionOn={IS_vocabSelectionOn}
        selectedVocab_COUNT={selected_VOCABS.size}
        CANCEL_selection={CANCEL_selection}
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
        showTitle={showTitle}
        IS_vocabSelectionOn={IS_vocabSelectionOn}
        TOGGLE_isVocabSelectionOn={TOGGLE_vocabSelection}
        HANDLE_vocabSelection={HANDLE_vocabSelection}
        selected_VOCABS={selected_VOCABS}
        CANCEL_selection={CANCEL_selection}
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

        {/* // 🔴🔴 TODO ==> Create a separarte DisplaySettingsModal for each case, then just pass in the props like lang ids */}

        <DisplaySettings_MODAL
          starting_TAB="vocab-preview"
          type="my-vocabs"
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
          lang_IDS={lang_IDS}
        />
      </Portal>
    </>
  );
}
