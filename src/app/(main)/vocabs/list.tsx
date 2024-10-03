//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import {
  Vocab_MODAL,
  MyVocabDisplaySettings_MODAL,
  MyVocabs_HEADER,
  MyVocabs_SUBNAV,
  Vocabs_FLATLIST,
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import { VocabDisplaySettings_PROPS, Vocab_MODEL } from "@/src/db/models";
import React, { useCallback, useMemo, useState } from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { USE_searchedVocabs } from "@/src/features/2_vocabs/hooks/USE_searchedVocabs/USE_searchedVocabs";
import GET_uniqueLanguagesInAList from "@/src/utils/GET_uniqueLanguagesInAList/GET_uniqueLanguagesInAList";
import { USE_langs } from "@/src/context/Langs_CONTEXT";
import USE_filteredVocabs from "@/src/features/2_vocabs/hooks/USE_filteredVocabs/USE_filteredVocabs";
import USE_deleteVocab from "@/src/features/2_vocabs/hooks/USE_deleteVocab";
import Confirmation_MODAL from "@/src/components/Modals/Small_MODAL/Variations/Confirmation_MODAL/Confirmation_MODAL";
import { ToastProvider, useToast } from "react-native-toast-notifications";
import USE_zustand from "@/src/zustand";
import DeleteVocab_MODAL from "@/src/features/2_vocabs/components/DeleteVocab_MODAL/DeleteVocab_MODAL";
import Notification_BOX from "@/src/components/Notification_BOX/Notification_BOX";

export default function SingleList_PAGE() {
  const router = useRouter();
  const { selected_LIST } = USE_selectedList();
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);
  const [SHOW_listSettingsModal, TOGGLE_listSettingsModal] = USE_toggle(false);
  const { user } = USE_auth();
  const { t } = useTranslation();
  const { languages } = USE_langs();
  const toast = useToast();

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>(
    selected_LIST?.vocabs || []
  );

  const [displaySettings, SET_displaySettings] =
    useState<VocabDisplaySettings_PROPS>({
      SHOW_image: false,
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
      sorting: "difficulty",
      sortDirection: "ascending",
      difficultyFilters: [],
      langFilters: [],
    });

  const { searched_VOCABS, search, SEARCH_vocabs, ARE_vocabsSearching } =
    USE_searchedVocabs(vocabs);
  // // const [filtered_VOCABS, SET_filteredVocabs] = useState<Vocab_MODEL[]>(vocabs);
  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>(
    undefined
  );

  const { filtered_VOCABS, ARE_vocabsFiltering } = USE_filteredVocabs({
    vocabs: searched_VOCABS,
    displaySettings,
  });

  const list_LANGS = useMemo(
    () => GET_uniqueLanguagesInAList(vocabs, languages),
    [vocabs]
  );

  // const [IS_listNameHighlighted, SET_isListNameHightighted] = useState(false);
  const { highlighted_ID, highlight } = USE_highlighedId();
  const {
    isHighlighted: IS_listNameHighlighted,
    highlight: HIGHLIGHT_listName,
  } = USE_highlightBoolean();

  function HANDLE_vocabModal({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) {
    if (!clear && vocab) {
      SET_targetVocab(vocab);
      TOGGLE_vocabModal();
    } else if (clear) {
      SET_targetVocab(undefined);
      TOGGLE_vocabModal();
    }
  }

  const [SHOW_deleteVocabModal, SET_deleteVocabModal] = useState(false);
  const [toDeleteVocab_ID, SET_toDeleteVocab] = useState<string | undefined>();
  const PREPARE_vocabDelete = (id: string) => {
    SET_toDeleteVocab(id);
    SET_deleteVocabModal(true);
  };

  return (
    <Page_WRAP>
      <MyVocabs_HEADER
        list_NAME={selected_LIST?.name && selected_LIST.name}
        btnBack_ACTION={() => router.back()}
        btnDots_ACTION={TOGGLE_listSettingsModal}
        IS_listNameHighlighted={IS_listNameHighlighted}
      />
      {vocabs && vocabs.length > 0 && (
        <MyVocabs_SUBNAV
          search={search}
          SET_search={SEARCH_vocabs}
          {...{
            TOGGLE_displaySettings,
            HANDLE_vocabModal,
          }}
          activeFitlers={
            displaySettings.difficultyFilters.length +
            displaySettings.langFilters.length
          }
        />
      )}
      {ARE_vocabsSearching || ARE_vocabsFiltering ? <List_SKELETONS /> : null}

      {vocabs &&
      vocabs.length > 0 &&
      searched_VOCABS.length > 0 &&
      filtered_VOCABS.length > 0 ? (
        <Vocabs_FLATLIST
          vocabs={filtered_VOCABS}
          SHOW_bottomBtn={true}
          {...{
            highlightedVocab_ID: highlighted_ID,
            TOGGLE_vocabModal,
            HANDLE_vocabModal,
            displaySettings,
            PREPARE_vocabDelete,
          }}
        />
      ) : (
        <EmptyFlatList_BOTTM
          // emptyBox_TEXT={t("label.thisListIsEmpty")}
          emptyBox_TEXT={
            search !== "" ||
            displaySettings.langFilters.length > 0 ||
            displaySettings.difficultyFilters.length > 0
              ? t("label.noVocabsFound")
              : t("label.thisListIsEmpty")
          }
          btn_TEXT={t("btn.createVocab")}
          btn_ACTION={() => HANDLE_vocabModal({ clear: true })}
        />
      )}
      <MyVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
        list_LANGS={list_LANGS}
      />

      <Vocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        vocab={target_VOCAB}
        selected_LIST={selected_LIST}
        SET_vocabs={SET_vocabs}
        HIGHLIGHT_vocab={highlight}
        {...{ PREPARE_vocabDelete }}
      />
      <ListSettings_MODAL
        list={selected_LIST}
        open={SHOW_listSettingsModal}
        TOGGLE_open={TOGGLE_listSettingsModal}
        user_id={user?.id}
        backToIndex={() => router.back()}
        HIGHLIGHT_listName={HIGHLIGHT_listName}
      />
      <DeleteVocab_MODAL
        user={user}
        IS_open={SHOW_deleteVocabModal}
        is_public={false}
        vocab_id={toDeleteVocab_ID}
        list_id={selected_LIST?.id}
        CLOSE_modal={() => SET_deleteVocabModal(false)}
        onSuccess={() => {
          SET_vocabs((prev) => prev.filter((v) => v.id !== toDeleteVocab_ID));
          SET_toDeleteVocab(undefined);
          toast.show(t("notifications.vocabDeleted"), {
            type: "green",
            duration: 2000,
          });
          SET_deleteVocabModal(false);
        }}
      />
    </Page_WRAP>
  );
}
