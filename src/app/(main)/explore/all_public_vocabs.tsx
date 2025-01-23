//
//
//

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

import List_HEADER from "@/src/components/1_grouped/headers/listPage/List_HEADER";
import { useRouter } from "expo-router";

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_collectPublicListLangs } from "@/src/features/lists/functions";
import {
  ExploreVocabs_FLATLIST,
  VocabsFlatlistHeader_SECTION,
  VocabDisplaySettings_MODAL,
  SavePublicVocabToList_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { USE_supabaseVocabs } from "@/src/features/vocabs/functions";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
export default function AllPublicVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");
  const router = useRouter();

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  const { modals } = USE_modalToggles(["saveList", "displaySettings"]);

  const {
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
  } = USE_supabaseVocabs({
    type: "allPublicVocabs",
    search: debouncedSearch,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="🔤 All public vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        IS_searchBig={true}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <ExploreVocabs_FLATLIST
        {...{ vocabs, IS_searching }}
        error={fetchVocabs_ERROR}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          modals.saveList.set(true);
        }}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME="🔤 All public vocabs"
            vocabResults_COUNT={totalFilteredVocab_COUNT}
            z_vocabDisplay_SETTINGS={z_vocabDisplay_SETTINGS}
            z_SET_vocabDisplaySettings={z_SET_vocabDisplaySettings}
          />
        }
        listFooter_EL={
          <BottomAction_BLOCK
            type="vocabs"
            search={search}
            IS_debouncing={IS_debouncing}
            IS_loadingMore={IS_loadingMore}
            HAS_reachedEnd={HAS_reachedEnd}
            activeFilter_COUNT={activeFilter_COUNT}
            totalFilteredResults_COUNT={totalFilteredVocab_COUNT}
            LOAD_more={LOAD_more}
            RESET_search={() => SET_search("")}
            RESET_filters={() =>
              z_SET_vocabDisplaySettings({
                langFilters: [],
                difficultyFilters: [],
              })
            }
          />
        }
      />
      {/* ------------------------- MODALS ------------------------- */}
      <VocabDisplaySettings_MODAL
        open={modals.displaySettings.IS_open}
        TOGGLE_open={() => modals.displaySettings.toggle()}
        collectedLang_IDS={collectedLang_IDS}
        HAS_difficulties={false}
      />

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
      />
    </>
  );
}
