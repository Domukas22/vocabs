//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { PublicVocabs_HEADER } from "@/src/features/2_vocabs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_supabaseVocabs from "@/src/hooks/USE_supabaseVocabs";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";

import ExploreVocabsFlatlistBottom_SECTION from "@/src/features/2_vocabs/components/ExploreVocabsFlatlistBottom_SECTION";
import ExploreVocabs_FLATLIST from "@/src/features/2_vocabs/components/ExploreVocabs_FLATLIST";
import ExporeSingleList_SUBNAV from "@/src/components/ExporeSingleList_SUBNAV";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";
import { View } from "react-native";
import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";
import USE_fetchTotalPublicVocabCount from "@/src/features/2_vocabs/hooks/USE_fetchTotalPublicVocabCount";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import List_HEADER from "@/src/components/Header/List_HEADER";
import { useRouter } from "expo-router";

import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";
import USE_pagination from "@/src/hooks/USE_pagination";
import USE_isSearching from "@/src/hooks/USE_isSearching";
import FETCH_publicLists from "@/src/features/1_lists/utils/FETCH_publicLists";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";

export default function AllPublicVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);
  const router = useRouter();

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "save" },
  ]);

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
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="🔤 All public vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        IS_searchBig={true}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <ExploreVocabs_FLATLIST
        {...{ vocabs, IS_searching }}
        error={fetchVocabs_ERROR}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          TOGGLE_modal("save");
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
          <BottomAction_SECTION
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
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
        HAS_difficulties={false}
      />

      <SavePublicVocabToList_MODAL
        vocab={target_VOCAB}
        IS_open={modal_STATES.save}
        onSuccess={() => {
          TOGGLE_modal("save");
          toast.show(t("notifications.savedVocab"), {
            type: "success",
            duration: 3000,
          });
        }}
        TOGGLE_open={() => TOGGLE_modal("save")}
      />
    </Page_WRAP>
  );
}
