//
//
//

import VocabList_HEADER from "@/src/components/1_grouped/headers/listPage/VocabList_HEADER";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import {
  MyVocabs_FLATLIST,
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  DeleteVocab_MODAL,
} from "@/src/features/vocabs/components";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { USE_modalToggles } from "@/src/hooks/index";
import { USE_myVocabs } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";
import { FlashList } from "@shopify/flash-list";
import { Portal } from "@gorhom/portal";

export default function SavedVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const { modals } = USE_modalToggles([
    "updateVocab",
    "deleteVocab",
    "displaySettings",
  ]);

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();
  const list_REF = useRef<FlashList<any>>(null);

  const {
    vocabs,
    fetchVocabs_ERROR,
    HAS_reachedEnd,
    loading_STATE,
    unpaginated_COUNT,
    LOAD_moreVocabs,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_myVocabs({
    type: "marked",
    search: debouncedSearch,
  });

  useEffect(() => {
    if (fetchVocabs_ERROR?.value) console.error(fetchVocabs_ERROR);
  }, [fetchVocabs_ERROR]);

  return (
    <>
      <VocabList_HEADER
        SHOW_listName={showTitle}
        list_NAME="⭐ My saved vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search }}
      />
      <MyVocabs_FLATLIST
        _ref={list_REF}
        list_NAME={"⭐ My saved vocabs"}
        vocabs={vocabs}
        search={search}
        onScroll={handleScroll}
        IS_debouncing={IS_debouncing}
        debouncedSearch={debouncedSearch}
        HANDLE_updateModal={(vocab: Vocab_MODEL) => {
          SET_toUpdateVocab(vocab);
          modals.updateVocab.toggle();
        }}
        fetch_TYPE="byTargetList"
        highlightedVocab_ID={highlighted_ID}
        PREPARE_vocabDelete={(vocab: Vocab_MODEL) => {
          SET_targetDeleteVocab(vocab);
          modals.deleteVocab.set(true);
        }}
        RESET_search={() => SET_search("")}
        fetchVocabs_ERROR={fetchVocabs_ERROR}
        HAS_reachedEnd={HAS_reachedEnd}
        loading_STATE={loading_STATE}
        unpaginated_COUNT={unpaginated_COUNT}
        LOAD_more={LOAD_moreVocabs}
      />

      <Portal>
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
      </Portal>
    </>
  );
}
