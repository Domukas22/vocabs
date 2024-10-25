//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { PublicVocabs_HEADER } from "@/src/features/2_vocabs";
import React, { useState } from "react";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";

import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/Btn/Btn";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { ActivityIndicator } from "react-native";
import Vocab from "@/src/features/2_vocabs/components/Vocab/Vocab";
import PublicVocabBack_BTNS from "@/src/features/2_vocabs/components/Vocab/Components/PublicVocabBack_BTNS/PublicVocabBack_BTNS";
import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_supabasePublicVocabs from "@/src/hooks/USE_supabasePublicVocabs";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import OnePublicList_SUBNAV from "@/src/components/OnePublicList_SUBNAV";
import AllPublicVocabs_SUBNAV from "@/src/features/2_vocabs/components/AllPublicVocabs_SUBNAV";
import AllPublicVocabsBottom_SECTION from "@/src/features/2_vocabs/components/AllPublicVocabsBottom_SECTION";
import AllPublicVocabs_FLATLIST from "@/src/features/2_vocabs/components/AllPublicVocabs_FLATLIST";

export default function AllPublicVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();

  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
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
      <AllPublicVocabs_SUBNAV
        {...{ search, SET_search }}
        loading={ARE_langIdsCollecting}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      <AllPublicVocabs_FLATLIST
        {...{ vocabs }}
        bottom_SECTION={
          <AllPublicVocabsBottom_SECTION
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
