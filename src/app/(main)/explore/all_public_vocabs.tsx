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

  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_supabasePublicVocabs({
    search: debouncedSearch,
    z_vocabDisplay_SETTINGS,
    paginateBy: 5,
  });

  return (
    <Page_WRAP>
      <PublicVocabs_HEADER />
      <ExporeSingleList_SUBNAV
        {...{ search, SET_search }}
        loading={ARE_langIdsCollecting}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      <ExploreVocabs_FLATLIST
        {...{
          vocabs,
          IS_loadingMore,
          HAS_reachedEnd,
          ARE_vocabsFetching,
          LOAD_more,
        }}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          TOGGLE_modal("save");
        }}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            {...{ search, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings }}
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
