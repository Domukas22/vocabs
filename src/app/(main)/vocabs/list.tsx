//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import {
  CreateMyVocab_MODAL,
  MyVocabDisplaySettings_MODAL,
  MyVocabs_HEADER,
  MyVocabs_SUBNAV,
  MyVocabs_FLATLIST,
  DeleteVocab_MODAL,
  USE_filteredVocabs,
  USE_searchedVocabs,
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import { MyVocabDisplaySettings_PROPS, Vocab_MODEL } from "@/src/db/models";
import React, { useMemo, useState } from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import GET_uniqueLanguagesInAList from "@/src/features/4_languages/utils/GET_uniqueLanguagesInAList/GET_uniqueLanguagesInAList";
import { USE_langs } from "@/src/context/Langs_CONTEXT";

import { useToast } from "react-native-toast-notifications";
import USE_zustand from "@/src/zustand";
import GET_uniqueTagsInAList from "@/src/features/future/tags/GET_uniqueTagsInAList/GET_uniqueTagsInAList";
import UpdateMyVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import PublishPrivateVocabAsAdmin_MODAL from "@/src/features/2_vocabs/components/Modal/PublishPrivateVocabAsAdmin_MODAL/PublishPrivateVocabAsAdmin_MODAL";

export default function SingleList_PAGE() {
  const router = useRouter();
  const { selected_LIST } = USE_selectedList();
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_createVocabModal, TOGGLE_createVocabModal, SET_createVocabModal] =
    USE_toggle(false);
  const [SHOW_updateVocabModal, TOGGLE_updateVocabModal, SET_updateVocabModal] =
    USE_toggle(false);
  const [SHOW_listSettingsModal, TOGGLE_listSettingsModal] = USE_toggle(false);
  const { user } = USE_auth();
  const { t } = useTranslation();
  const { languages } = USE_langs();
  const toast = useToast();

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>(
    selected_LIST?.vocabs || []
  );

  const {
    z_lists,
    z_CREATE_privateVocab,
    z_DELETE_privateVocab,
    z_UPDATE_privateVocab,
  } = USE_zustand();

  const [displaySettings, SET_displaySettings] =
    useState<MyVocabDisplaySettings_PROPS>({
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
  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<Vocab_MODEL | undefined>(
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
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const {
    isHighlighted: IS_listNameHighlighted,
    highlight: HIGHLIGHT_listName,
  } = USE_highlightBoolean();

  function HANDLE_updateModal({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) {
    if (!clear && vocab) {
      SET_toUpdateVocab(vocab);
      SET_updateVocabModal(true);
    } else if (clear) {
      SET_toUpdateVocab(undefined);
      SET_updateVocabModal(false);
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
          onPlusIconPress={TOGGLE_createVocabModal}
          activeFitlers={
            displaySettings.difficultyFilters.length +
            displaySettings.langFilters.length
          }
          {...{ TOGGLE_displaySettings }}
        />
      )}
      {ARE_vocabsSearching || ARE_vocabsFiltering ? <List_SKELETONS /> : null}

      {vocabs &&
      vocabs.length > 0 &&
      searched_VOCABS.length > 0 &&
      filtered_VOCABS.length > 0 ? (
        <MyVocabs_FLATLIST
          vocabs={filtered_VOCABS}
          SHOW_bottomBtn={true}
          {...{
            highlightedVocab_ID: highlighted_ID,
            TOGGLE_updateVocabModal,
            TOGGLE_createVocabModal,
            HANDLE_updateModal,
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
          btn_ACTION={TOGGLE_createVocabModal}
        />
      )}
      <MyVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
        list_LANGS={list_LANGS}
      />

      <CreateMyVocab_MODAL
        IS_open={SHOW_createVocabModal}
        initial_LIST={selected_LIST}
        TOGGLE_modal={() => TOGGLE_createVocabModal()}
        onSuccess={(new_VOCAB: Vocab_MODEL) => {
          z_CREATE_privateVocab(new_VOCAB);
          SET_createVocabModal(false);

          if (new_VOCAB.list_id === selected_LIST.id) {
            SET_vocabs((prev) => [new_VOCAB, ...prev]);
            HIGHLIGHT_vocab(new_VOCAB.id);
            toast.show(t("notifications.vocabCreated"), {
              type: "green",
              duration: 3000,
            });
          } else {
            toast.show(
              t("notifications.vocabCreatedInAnotherListPre") +
                `"${
                  z_lists.find((l) => l.id === new_VOCAB.list_id)?.name || ""
                }"` +
                t("notifications.vocabCreatedInAnotherListPost"),
              {
                type: "green",
                duration: 5000,
              }
            );
          }
        }}
      />
      <UpdateMyVocab_MODAL
        {...{ toUpdate_VOCAB }}
        IS_open={SHOW_updateVocabModal}
        initial_LIST={selected_LIST}
        TOGGLE_modal={() => TOGGLE_updateVocabModal()}
        onSuccess={(updated_VOCAB: Vocab_MODEL) => {
          z_UPDATE_privateVocab(updated_VOCAB);
          SET_updateVocabModal(false);

          if (updated_VOCAB.list_id === selected_LIST.id) {
            SET_vocabs((prev) =>
              prev.map((vocab) => {
                if (vocab.id === updated_VOCAB.id) return updated_VOCAB;
                return vocab;
              })
            );
            HIGHLIGHT_vocab(updated_VOCAB.id);
            toast.show(t("notifications.vocabUpdated"), {
              type: "green",
              duration: 3000,
            });
          } else {
            toast.show(
              t("notifications.vocabUpdatedInAnotherListPre") +
                `"${
                  z_lists.find((l) => l.id === updated_VOCAB.list_id)?.name ||
                  ""
                }"` +
                t("notifications.vocabUpdatedInAnotherListPost"),
              {
                type: "green",
                duration: 5000,
              }
            );
          }
        }}
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
          z_DELETE_privateVocab(selected_LIST?.id, toDeleteVocab_ID || "");
          SET_toDeleteVocab(undefined);
          toast.show(t("notifications.vocabDeleted"), {
            type: "green",
            duration: 5000,
          });
          SET_deleteVocabModal(false);
        }}
      />
    </Page_WRAP>
  );
}
