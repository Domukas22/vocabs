//
//
//

import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";

import VocabList_NAV from "@/src/components/1_grouped/headers/listPage/VocabList_NAV";
import { FlashList } from "@shopify/flash-list";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import {
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  DeleteVocab_MODAL,
} from "@/src/features/vocabs/components";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { CreateMyVocab_MODAL } from "@/src/features/vocabs/components/1_myVocabs/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Portal } from "@gorhom/portal";
import { USE_modalToggles } from "@/src/hooks/index";
import { USE_observeMyTargetList } from "@/src/features/lists/functions";
import { USE_myVocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/USE_myVocabs";
import { Vocab_LIST } from "@/src/features/vocabs/vocabList/Vocabs_LIST/Vocabs_LIST";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { GET_vocabListComponents } from "@/src/features/vocabs/vocabList/GET_vocabListComponents/GET_vocabListComponents";
import { USE_targetVocabs } from "@/src/features/vocabs/vocabList/USE_targetVocabs/USE_targetVocabs";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { Delay } from "@/src/utils";

const fetch_TYPE: vocabFetch_TYPES = "byTargetList";
const list_TYPE: vocabList_TYPES = "private";

export default function SingleList_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { list_id } = USE_listIdInParams();
  const selected_LIST = USE_observeMyTargetList(list_id);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const list_REF = useRef<FlashList<any>>(null);

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const {
    toUpdate_VOCAB,
    toDelete_VOCAB,
    toMove_VOCAB,
    SET_targetVocab,
    RESET_targetVocabs,
  } = USE_targetVocabs();

  const { modals } = USE_modalToggles([
    "createVocab",
    "deleteVocab",
    "updateVocab",
    "listSettings",
    "displaySettings",
  ]);

  const {
    vocabs,
    vocabs_ERROR,
    HAS_reachedEnd,
    loading_STATE,
    unpaginated_COUNT,
    LOAD_moreVocabs,
    r_UPDATE_oneVocab,
    r_PREPEND_oneVocab,
    r_DELETE_oneVocab,
  } = USE_myVocabs({
    fetch_TYPE,
    list_TYPE,
    targetList_ID: list_id,
    search: debouncedSearch,
  });

  const { Flashlist_HEADER, Flashlist_FOOTER, Card } = GET_vocabListComponents({
    IS_debouncing,
    debouncedSearch,
    search,
    loading_STATE,
    list_NAME: selected_LIST?.name || "",
    unpaginated_COUNT,
    vocabs_ERROR,
    HAS_reachedEnd,
    highlighted_ID: highlighted_ID || "",
    fetch_TYPE,
    list_TYPE,
    OPEN_modalCreateVocab: () => modals.createVocab.set(true),
    OPEN_modalUpdateVocab: (vocab: Vocab_TYPE) => {
      SET_targetVocab(vocab, "update");
      modals.updateVocab.set(true);
    },
    LOAD_moreVocabs,
    RESET_search: () => SET_search(""),
  });

  return (
    <>
      <VocabList_NAV
        SHOW_listName={showTitle}
        list_NAME={selected_LIST?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        OPEN_create={() => modals.createVocab.set(true)}
        {...{ search, SET_search }}
      />
      <Btn
        text="remove first"
        onPress={() => r_DELETE_oneVocab(vocabs?.[0]?.id)}
      />
      <Vocab_LIST
        vocabs={vocabs}
        Header={<></>}
        Footer={<></>}
        Header={<Flashlist_HEADER />}
        Footer={<Flashlist_FOOTER />}
        Vocab_CARD={Card}
        flashlist_REF={list_REF}
        highlightedVocab_ID={highlighted_ID}
        onScroll={handleScroll}
        HIDE_vocabs={IS_debouncing || !!vocabs_ERROR}
      />

      <Portal>
        <CreateMyVocab_MODAL
          IS_open={modals.createVocab.IS_open}
          initial_LIST={selected_LIST}
          TOGGLE_modal={() => modals.createVocab.set(false)}
          onSuccess={(new_VOCAB: Vocab_TYPE) => {
            modals.createVocab.set(false);
            RESET_targetVocabs();

            HIGHLIGHT_vocab(new_VOCAB.id);
            r_PREPEND_oneVocab(new_VOCAB);
            list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
            toast.show(t("notifications.vocabCreated"), {
              type: "success",
              duration: 3000,
            });
          }}
        />
        <UpdateMyVocab_MODAL
          toUpdate_VOCAB={toUpdate_VOCAB}
          IS_open={modals.updateVocab.IS_open}
          CLOSE_modal={() => {
            modals.updateVocab.set(false);
            RESET_targetVocabs();
          }}
          onSuccess={(updated_VOCAB: Vocab_TYPE) => {
            modals.updateVocab.set(false);
            RESET_targetVocabs();
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
          collectedLang_IDS={
            selected_LIST?.collected_lang_ids?.split(",") || []
          }
        />
        <ListSettings_MODAL
          selected_LIST={selected_LIST}
          open={modals.listSettings.IS_open}
          TOGGLE_open={() => modals.listSettings.set(false)}
          backToIndex={() => router.back()}
        />
        <DeleteVocab_MODAL
          IS_open={modals.deleteVocab.IS_open}
          vocab={toDelete_VOCAB}
          CLOSE_modal={() => {
            modals.deleteVocab.set(false);
            RESET_targetVocabs();
          }}
          onSuccess={() => {
            RESET_targetVocabs();
            modals.deleteVocab.set(false);
            r_DELETE_oneVocab(toDelete_VOCAB?.id || "");

            toast.show(t("notifications.vocabDeleted"), {
              type: "success",
              duration: 5000,
            });
          }}
        />
      </Portal>
    </>
  );
}
