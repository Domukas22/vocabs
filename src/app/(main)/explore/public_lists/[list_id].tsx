//
//
//

import React from "react";
// import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import { USE_showListHeaderTitle, USE_debounceSearch } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { USE_getListName } from "@/src/features_new/lists/hooks/USE_getListName/USE_getListName";
import PublicVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/PublicVocabs_FLASHLIST/PublicVocabs_FLASHLIST";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/_parts/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { Portal } from "@gorhom/portal";
import { PublicOneList_NAV } from "@/src/features_new/lists/components/navs";
import { Flashlist_HEADER } from "@/src/components/Flashlist_HEADER/Flashlist_HEADER";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { DisplaySettings_MODAL } from "@/src/components/DisplaySettings_MODAL/DisplaySettings_MODAL";
import {} from "@/src/features/vocabs/components";
import { USE_vocabs } from "@/src/features_new/vocabs/hooks/USE_vocabs/USE_vocabs";
import { z_USE_user } from "@/src/features_new/user/hooks/z_USE_user/z_USE_user";
import { SaveVocab_MODAL } from "@/src/features_new/vocabs/components/modals/SaveVocab_MODAL/SaveVocab_MODAL";
import { SaveList_MODAL } from "@/src/features_new/lists/components/modals/SaveList_MODAL/SaveList_MODAL";

export default function PublicListVocabs_PAGE() {
  const { urlParamsList_ID } = USE_listIdInParams();
  const { list_NAME } = USE_getListName({ type: "public" });
  const { modals } = USE_modalToggles([
    "saveList",
    "saveVocab",
    "displaySettings",
  ]);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search, RESET_search } =
    USE_debounceSearch();

  const { filters, sorting, z_GET_activeFilterCount } =
    z_USE_publicVocabsDisplaySettings();

  const { z_user } = z_USE_user();

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
    IS_private: false,
    search,
    targetList_ID: urlParamsList_ID,
    filters,
    sorting,
    user: z_user,
  });

  return (
    <>
      <PublicOneList_NAV
        SHOW_listName={showTitle}
        search={search}
        SET_search={SET_search}
        OPEN_saveListModal={() => modals.saveList.set(true)}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
      />
      <PublicVocabs_FLASHLIST
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        vocabs={vocabs}
        fetch_TYPE={"byTargetList"}
        loading_STATE={loading_STATE}
        error={error}
        highlighted_ID={highlighted_ID || ""}
        OPEN_copyVocabModal={() => modals.saveList.set(true)}
        Header={
          <Flashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={list_NAME}
            unpaginated_COUNT={unpaginated_COUNT}
            appliedFilter_COUNT={z_GET_activeFilterCount() || 0}
            type="public-vocabs"
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

      {/* ------------------------------------------------------------------ MODALS ------------------------------------------------------------------ */}
      <Portal>
        <DisplaySettings_MODAL
          starting_TAB="vocab-preview"
          type="public-vocabs"
          lang_IDS={lang_IDS}
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
        <SaveVocab_MODAL
          IS_open={modals.saveVocab.IS_open}
          CLOSE_modal={() => modals.saveVocab.set(false)}
        />
        <SaveList_MODAL
          IS_open={modals.saveList.IS_open}
          CLOSE_modal={() => modals.saveList.set(false)}
        />
        {/*
        <SavePublicVocabToList_MODAL
          vocab={target_VOCAB}
          IS_open={modals.saveList.IS_open}
          onSuccess={() => {
            modals.saveList.set(false);
            toast.show(t("notifications.savedVocab"), {
              type: "success",
              duration: 3000,
            });
          }}
          TOGGLE_open={() => modals.saveList.set(false)}
        /> */}
        {/*
        <CopyListAndVocabs_MODAL
          error={copyList_ERROR}
          IS_open={modals.saveList.IS_open}
          IS_copying={IS_copyingList}
          copy={copy}
          RESET_error={RESET_copyListError}
          CLOSE_modal={() => modals.saveList.set(false)}
        />*/}
      </Portal>
    </>
  );
}
