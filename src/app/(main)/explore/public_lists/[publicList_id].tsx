//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { useTranslation } from "react-i18next";
import React from "react";
import { useToast } from "react-native-toast-notifications";

import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import USE_supabaseVocabsOfAList from "@/src/features/2_vocabs/hooks/USE_supabaseVocabsOfAList";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_fetchOnePublicList from "@/src/features/2_vocabs/hooks/USE_fetchOnePublicList";
import OnePublicList_SUBNAV from "@/src/components/OnePublicList_SUBNAV";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import PublicList_HEADER from "@/src/features/1_lists/components/PublicList_HEADER";
import OnePublicListBottom_SECTION from "@/src/features/1_lists/components/OnePublicListBottom_SECTION";
import PublicListVocabs_FLATLIST from "@/src/features/2_vocabs/components/PublicListVocabs_FLATLIST";

export default function PublicListVocabs_PAGE() {
  const toast = useToast();
  const { t } = useTranslation();
  const { publicList_id } = useLocalSearchParams();
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "save" },
    { name: "displaySettings" },
  ]);

  const { list, IS_listFetching, listFetch_ERROR } = USE_fetchOnePublicList(
    typeof publicList_id === "string" ? publicList_id : ""
  );

  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_supabaseVocabsOfAList({
    search: debouncedSearch,
    list,
    z_vocabDisplay_SETTINGS,
    paginateBy: 3,
  });

  const collectedLangIds = useMemo(() => {
    // infinite loop occurs if not defined
    return list?.collected_lang_ids || [];
  }, [list?.collected_lang_ids]);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  return (
    <Page_WRAP>
      <PublicList_HEADER list_NAME={list?.name} {...{ IS_listFetching }} />
      <OnePublicList_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        loading={IS_listFetching || ARE_vocabsFetching}
        {...{ search, SET_search }}
      />

      <PublicListVocabs_FLATLIST
        {...{ vocabs }}
        bottom_SECTION={
          <OnePublicListBottom_SECTION
            {...{
              IS_loadingMore,
              HAS_reachedEnd,
              ARE_vocabsFetching,
              LOAD_more,
            }}
          />
        }
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          TOGGLE_modal("save");
        }}
      />
      {/* ------------------------------------------------------------------ MODALS ------------------------------------------------------------------ */}
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
        collectedLang_IDS={collectedLangIds}
        HAS_difficulties={false}
      />
    </Page_WRAP>
  );
}
