//
//
//

import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import List_MODEL from "@/src/db/models/List_MODEL";

import { withObservables } from "@nozbe/watermelondb/react";
import { USE_sync } from "@/src/hooks/USE_sync/USE_sync";
import { USE_myVocabs } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";

import { USE_zustand } from "@/src/hooks";

import { Lists_DB } from "@/src/db";
import List_HEADER from "@/src/components/1_grouped/headers/listPage/List_HEADER";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import { FlashList } from "@shopify/flash-list";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import {
  MyVocabs_FLATLIST,
  VocabsFlatlistHeader_SECTION,
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  DeleteVocab_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { CreateMyVocab_MODAL } from "@/src/features/vocabs/components/1_myVocabs/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Portal } from "@gorhom/portal";
import { USE_modalToggles } from "@/src/hooks/index";
import { USE_observeMyTargetList } from "@/src/features/lists/functions";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { MyColors } from "@/src/constants/MyColors";

export default function SingleList_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { list_id } = useLocalSearchParams();

  const selected_LIST = USE_observeMyTargetList(
    typeof list_id === "string" ? list_id : ""
  );

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { showTitle, handleScroll } = USE_showListHeaderTitle();

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const list_REF = useRef<FlashList<any>>(null);

  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

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

  // const HANDLE_updateModal = useCallback(
  //   ({ clear = false, vocab }: { clear?: boolean; vocab?: Vocab_MODEL }) => {
  //     SET_toUpdateVocab(!clear && vocab ? vocab : undefined);
  //     modals.updateVocab.toggle();
  //   },
  //   [SET_toUpdateVocab]
  // );

  const {
    vocabs,
    fetchVocabs_ERROR,
    HAS_reachedEnd,
    loading_STATE,
    unpaginated_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_myVocabs({
    type: "byTargetList",
    targetList_ID: selected_LIST?.id,
    search: debouncedSearch,
    IS_debouncing,
  });

  return (
    <>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME={selected_LIST?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        OPEN_create={() => modals.createVocab.set(true)}
        {...{ search, SET_search }}
        oneList
      />

      <MyVocabs_FLATLIST
        _ref={list_REF}
        list={selected_LIST}
        onScroll={handleScroll}
        search={search}
        debouncedSearch={debouncedSearch}
        IS_debouncing={IS_debouncing}
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
        OPEN_createVocabModal={() => modals.createVocab.set(true)}
        vocabs={vocabs}
        fetchVocabs_ERROR={fetchVocabs_ERROR}
        HAS_reachedEnd={HAS_reachedEnd}
        loading_STATE={loading_STATE}
        unpaginated_COUNT={unpaginated_COUNT}
        LOAD_more={LOAD_more}
      />

      <Portal>
        <CreateMyVocab_MODAL
          IS_open={modals.createVocab.IS_open}
          initialList_ID={selected_LIST?.id}
          TOGGLE_modal={() => modals.createVocab.set(false)}
          onSuccess={(new_VOCAB: Vocab_MODEL) => {
            modals.createVocab.set(false);

            HIGHLIGHT_vocab(new_VOCAB.id);
            ADD_toDisplayed(new_VOCAB);
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
