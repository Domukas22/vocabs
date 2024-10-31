//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { PublicVocabs_HEADER } from "@/src/features/2_vocabs";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_supabasePublicVocabs from "@/src/hooks/USE_supabasePublicVocabs";
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
import Margin_SECTION from "@/src/components/Margin_SECTION";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";

export default function AllPublicVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "save" },
  ]);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  const { vocab_COUNT, IS_totalCountFetching, fetchTotalCount_ERROR } =
    USE_fetchTotalPublicVocabCount();

  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    totalFilteredVocab_COUNT,
  } = USE_supabasePublicVocabs({
    search: debouncedSearch,
    z_vocabDisplay_SETTINGS,
    paginateBy: 5,
  });

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);
  const router = useRouter();

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
      <Margin_SECTION />
      <ExploreVocabs_FLATLIST
        {...{ vocabs }}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          TOGGLE_modal("save");
        }}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            list_NAME="🔤 All public vocabs"
            totalVocabs={vocab_COUNT}
            vocabResults_COUNT={totalFilteredVocab_COUNT}
            {...{ search, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings }}
          />
        }
        listFooter_EL={
          <BottomAction_SECTION
            {...{
              search,
              LOAD_more,
              IS_loadingMore,
              activeFilter_COUNT,
              totalFilteredResults_COUNT: totalFilteredVocab_COUNT,
              HAS_reachedEnd: vocabs?.length >= totalFilteredVocab_COUNT,
            }}
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
            type: "green",
            duration: 3000,
          });
        }}
        TOGGLE_open={() => TOGGLE_modal("save")}
      />
    </Page_WRAP>
  );
}
