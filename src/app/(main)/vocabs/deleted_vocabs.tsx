//
//
//

import VocabList_HEADER from "@/src/components/1_grouped/headers/listPage/VocabList_HEADER";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import {
  MyVocabs_FLATLIST,
  ReviveDeletedVocab_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import { USE_myVocabs } from "@/src/features/vocabs/functions/1_myVocabs/fetch/USE_myVocabs/USE_myVocabs";
import { FlashList } from "@shopify/flash-list";

export default function DeletedVocabs_PAGE() {
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
  const [targetRevive_VOCAB, SET_targetReviveVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const { modals } = USE_modalToggles([
    "reviveVocab",
    "deleteVocab",
    "displaySettings",
  ]);

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();
  const list_REF = useRef<FlashList<any>>(null);

  const {
    vocabs,
    vocabs_ERROR: vocabs_ERROR,
    HAS_reachedEnd,
    loading_STATE,
    unpaginated_COUNT,
    LOAD_moreVocabs,
    ADD_vocabToReducer,
    REMOVE_vocabFromReducer,
  } = USE_myVocabs({
    type: "deletedVocabs",
    search: debouncedSearch,
  });

  return (
    <>
      <VocabList_HEADER
        SHOW_listName={showTitle}
        list_NAME="🗑️ Deleted vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <MyVocabs_FLATLIST
        _ref={list_REF}
        list_NAME="🗑️ Deleted vocabs"
        vocabs={vocabs}
        search={search}
        onScroll={handleScroll}
        IS_debouncing={IS_debouncing}
        debouncedSearch={debouncedSearch}
        fetch_TYPE="byTargetList"
        highlightedVocab_ID={highlighted_ID}
        PREPARE_vocabDelete={(vocab: Vocab_MODEL) => {
          SET_targetDeleteVocab(vocab);
          modals.deleteVocab.set(true);
        }}
        RESET_search={() => SET_search("")}
        vocabs_ERROR={vocabs_ERROR}
        HAS_reachedEnd={HAS_reachedEnd}
        loading_STATE={loading_STATE}
        unpaginated_COUNT={unpaginated_COUNT}
        LOAD_more={LOAD_moreVocabs}
        SELECT_forRevival={(vocab: Vocab_MODEL) => {}}
      />

      <Portal>
        <ReviveDeletedVocab_MODAL
          vocab={targetRevive_VOCAB}
          IS_open={modals.reviveVocab.IS_open}
          onSuccess={(new_VOCAB: Vocab_MODEL) => {
            modals.reviveVocab.set(false);

            HIGHLIGHT_vocab(new_VOCAB.id);
            REMOVE_vocabFromReducer(new_VOCAB.id);
            toast.show(t("notifications.vocabRevived"), {
              type: "success",
              duration: 3000,
            });
          }}
          TOGGLE_open={() => modals.reviveVocab.set(false)}
        />

        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
          collectedLang_IDS={[]}
        />
      </Portal>
    </>
  );
}
