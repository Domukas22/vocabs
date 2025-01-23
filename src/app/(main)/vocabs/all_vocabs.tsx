//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import List_HEADER from "@/src/components/1_grouped/headers/listPage/List_HEADER";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import {
  MyVocabs_FLATLIST,
  VocabsFlatlistHeader_SECTION,
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  DeleteVocab_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import {
  USE_myTotalVocabCount,
  USE_vocabs,
} from "@/src/features/vocabs/functions";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { CreateMyVocab_MODAL } from "@/src/features/vocabs/components/1_myVocabs/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { USE_modalToggles } from "@/src/hooks/index";

export default function AllVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();

  const { z_user, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } =
    USE_zustand();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const totalListVocab_COUNT = USE_myTotalVocabCount(z_user);

  const { modals } = USE_modalToggles([
    "createVocab",
    "deleteVocab",
    "updateVocab",
    "listSettings",
    "displaySettings",
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
    modals.updateVocab.toggle();
  }

  const {
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_vocabs({
    type: "allVocabs",
    search: debouncedSearch,
    user_id: z_user?.id,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="All my vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_create={() => modals.createVocab.set(true)}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <MyVocabs_FLATLIST
        {...{ vocabs, IS_searching, HANDLE_updateModal }}
        type="normal"
        highlightedVocab_ID={highlighted_ID}
        PREPARE_vocabDelete={(vocab: Vocab_MODEL) => {
          SET_targetDeleteVocab(vocab);
          modals.deleteVocab.set(false);
        }}
        error={fetchVocabs_ERROR}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME="All my vocabs"
            vocabResults_COUNT={totalFilteredVocab_COUNT}
            z_vocabDisplay_SETTINGS={z_vocabDisplay_SETTINGS}
            z_SET_vocabDisplaySettings={z_SET_vocabDisplaySettings}
          />
        }
        listFooter_EL={
          <BottomAction_BLOCK
            type="vocabs"
            createBtn_ACTION={() => modals.createVocab.set(true)}
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

      <CreateMyVocab_MODAL
        IS_open={modals.createVocab.IS_open}
        TOGGLE_modal={() => modals.createVocab.set(false)}
        onSuccess={(new_VOCAB: Vocab_MODEL) => {
          modals.createVocab.set(false);
          HIGHLIGHT_vocab(new_VOCAB.id);
          ADD_toDisplayed(new_VOCAB);
          toast.show(t("notifications.vocabCreated"), {
            type: "success",
            duration: 3000,
          });
        }}
      />
      <UpdateMyVocab_MODAL
        toUpdate_VOCAB={toUpdate_VOCAB}
        IS_open={modals.updateVocab.IS_open}
        TOGGLE_modal={() => modals.updateVocab.set(false)}
        onSuccess={(updated_VOCAB: Vocab_MODEL) => {
          modals.updateVocab.set(false);
          HIGHLIGHT_vocab(updated_VOCAB.id);

          toast.show(t("notifications.vocabUpdated"), {
            type: "success",
            duration: 3000,
          });
        }}
      />
      <VocabDisplaySettings_MODAL
        open={modals.displaySettings.IS_open}
        TOGGLE_open={() => modals.displaySettings.set(false)}
        collectedLang_IDS={[]}
      />

      <DeleteVocab_MODAL
        IS_open={modals.deleteVocab.IS_open}
        vocab={targetDelete_VOCAB}
        CLOSE_modal={() => modals.deleteVocab.set(false)}
        onSuccess={() => {
          toast.show(t("notifications.vocabDeleted"), {
            type: "success",
            duration: 5000,
          });
          REMOVE_fromDisplayed(targetDelete_VOCAB?.id || "");
          modals.deleteVocab.set(false);
        }}
      />
    </>
  );
}
