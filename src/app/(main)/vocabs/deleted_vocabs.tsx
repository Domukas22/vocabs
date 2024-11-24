//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter } from "expo-router";

import React, { useState } from "react";

import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";

import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";

import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";

import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";

import USE_zustand from "@/src/zustand";

import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";

import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";

import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";

import { USE_totalUserVocabs } from "@/src/hooks/USE_totalUserVocabs";
import ReviveDeletedVocab_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/ReviveDeletedVocab_MODAL";
import { USE_vocabs } from "@/src/features/1_lists/hooks/USE_vocabs";
import Vocabs_FLATLIST from "@/src/features/2_vocabs/components/Vocabs_FLATLIST";

export default function DeletedVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();

  const { z_user, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } =
    USE_zustand();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const [targetRevive_VOCAB, SET_targetReviveVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const totalListVocab_COUNT = USE_totalUserVocabs(z_user);

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "listSettings" },
    { name: "createVocab" },
    { name: "delete" },
    { name: "update" },
    { name: "revive" },
  ]);

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();

  function HANDLE_updateModal({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) {
    SET_toUpdateVocab(!clear && vocab ? vocab : undefined);
    TOGGLE_modal("update");
  }

  const {
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
    REMOVE_fromDisplayed,
  } = USE_vocabs({
    type: "deletedVocabs",
    search: debouncedSearch,
    user_id: z_user?.id,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="Deleted vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        OPEN_create={() => TOGGLE_modal("createVocab")}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <Vocabs_FLATLIST
        {...{ vocabs, IS_searching, HANDLE_updateModal }}
        type="delete"
        highlightedVocab_ID={highlighted_ID}
        PREPARE_vocabDelete={(vocab: Vocab_MODEL) => {
          SET_targetDeleteVocab(vocab);
          TOGGLE_modal("delete");
        }}
        SELECT_forRevival={(vocab: Vocab_MODEL) => {
          SET_targetReviveVocab(vocab);
          TOGGLE_modal("revive");
        }}
        error={fetchVocabs_ERROR}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME="Deleted vocabs"
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

      <ReviveDeletedVocab_MODAL
        vocab={targetRevive_VOCAB}
        IS_open={modal_STATES.revive}
        onSuccess={(new_VOCAB: Vocab_MODEL) => {
          TOGGLE_modal("revive");
          HIGHLIGHT_vocab(new_VOCAB.id);
          REMOVE_fromDisplayed(new_VOCAB.id);
          toast.show(t("notifications.vocabRevived"), {
            type: "success",
            duration: 3000,
          });
        }}
        TOGGLE_open={() => TOGGLE_modal("revive")}
      />

      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={[]}
      />
    </Page_WRAP>
  );
}
