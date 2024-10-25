//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

import { useTranslation } from "react-i18next";
import React from "react";
import { useToast } from "react-native-toast-notifications";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";

import USE_supabaseVocabsOfAList from "@/src/features/2_vocabs/hooks/USE_supabaseVocabsOfAList";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_fetchOneSharedList from "@/src/features/2_vocabs/hooks/USE_fetchOneSharedList";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import OneSharedList_HEADER from "@/src/features/1_lists/components/OneSharedList_HEADER";

import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import ExporeSingleList_SUBNAV from "@/src/components/ExporeSingleList_SUBNAV";
import ExploreVocabs_FLATLIST from "@/src/features/2_vocabs/components/ExploreVocabs_FLATLIST";
import ExploreVocabsFlatlistBottom_SECTION from "@/src/features/2_vocabs/components/ExploreVocabsFlatlistBottom_SECTION";
import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";

export default function PublicListVocabs_PAGE() {
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { t } = useTranslation();
  const { sharedList_id } = useLocalSearchParams();
  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();
  const toast = useToast();

  const { sharedList, IS_sharedListFetching, sharedList_ERROR } =
    USE_fetchOneSharedList(
      typeof sharedList_id === "string" ? sharedList_id : ""
    );

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "save" },
    { name: "displaySettings" },
  ]);

  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_supabaseVocabsOfAList({
    search: debouncedSearch,
    list: sharedList,
    z_vocabDisplay_SETTINGS,
    paginateBy: 3,
  });

  const collectedLang_IDS = useMemo(() => {
    // infinite loop occurs if not defined
    return sharedList?.collected_lang_ids || [];
  }, [sharedList?.collected_lang_ids]);

  return (
    <Page_WRAP>
      <OneSharedList_HEADER
        list_NAME={sharedList?.name}
        {...{ ARE_vocabsFetching }}
      />
      <ExporeSingleList_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        loading={false}
        {...{ search, SET_search }}
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
            totalVocabs={sharedList?.vocabs?.[0]?.count}
            {...{ search, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings }}
          />
        }
      />

      {/* -------------------------------------------- MODALS -------------------------------------------- */}

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

      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
        HAS_difficulties={false}
      />
    </Page_WRAP>
  );
}
