//
//
//

import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import List_MODEL from "@/src/db/models/List_MODEL";
import { useTranslation } from "react-i18next";
import React from "react";
import { useToast } from "react-native-toast-notifications";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import { CopyListAndVocabs_MODAL } from "@/src/features/lists/components";
import {
  USE_fetchOnePublicList,
  USE_copyListAndItsVocabs,
  USE_incrementPublicListSavedCount,
} from "@/src/features/lists/functions";
import {
  ExploreVocabs_FLATLIST,
  VocabFlashlist_HEADER,
  SavePublicVocabToList_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { USE_supabaseVocabs } from "@/src/features/vocabs/functions";
import { USE_showListHeaderTitle, USE_debounceSearch } from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { z_USE_publicVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import USE_controlPublicVocabsFetch from "@/src/features_new/vocabs/hooks/fetchVocabs/USE_controlPublicVocabsFetch/USE_controlPublicVocabsFetch";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { USE_getListName } from "@/src/features_new/lists/hooks/USE_getListName/USE_getListName";
import PublicVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/PublicVocabs_FLASHLIST/PublicVocabs_FLASHLIST";
import { t } from "i18next";
import { VocabFlatlist_FOOTER } from "@/src/features_new/vocabs/components/flashlists/components/VocabFlatlist_FOOTER/VocabFlatlist_FOOTER";
import { Portal } from "@gorhom/portal";

export default function PublicListVocabs_PAGE() {
  const { urlParamsList_ID } = USE_listIdInParams();
  const { list_NAME } = USE_getListName({ type: "public" });
  const { modals } = USE_modalToggles(["saveList", "displaySettings"]);

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
    fetch_TYPE: "byTargetList",
    targetList_ID: urlParamsList_ID,
  });

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME={list_NAME}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SAVE_list={() => modals.saveList.set(true)}
        {...{ search, SET_search }}
      />

      <PublicVocabs_FLASHLIST
        IS_debouncing={IS_debouncing}
        handleScroll={handleScroll}
        Header={
          <VocabFlashlist_HEADER
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={z_publicVocabsLoading_STATE}
            list_NAME={list_NAME}
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

      {/* ------------------------------------------------------------------ MODALS ------------------------------------------------------------------ */}
      <Portal>
        {/* <SavePublicVocabToList_MODAL
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
      />

      <VocabDisplaySettings_MODAL
        open={modals.displaySettings.IS_open}
        TOGGLE_open={() => modals.displaySettings.set(false)}
        collectedLang_IDS={collectedLangIds}
        HAS_difficulties={false}
      />
      <CopyListAndVocabs_MODAL
        error={copyList_ERROR}
        IS_open={modals.saveList.IS_open}
        IS_copying={IS_copyingList}
        copy={copy}
        RESET_error={RESET_copyListError}
        CLOSE_modal={() => modals.saveList.set(false)}
      /> */}
      </Portal>
    </>
  );
}
