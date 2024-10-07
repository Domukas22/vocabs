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
  PublicVocabs_SUBNAV,
  PublicVocabs_HEADER,
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import {
  MyVocabDisplaySettings_PROPS,
  PublicVocabDisplaySettings_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import React, { useEffect, useMemo, useState } from "react";
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
import USE_filteredPublicVocabs from "@/src/features/2_vocabs/hooks/USE_filteredPublicVocabs/USE_filteredPublicVocabs";
import USE_fetchPublicVocabs from "@/src/features/2_vocabs/hooks/USE_fetchPublicVocabs";
import PublicVocabs_FLATLIST from "@/src/features/2_vocabs/components/Flatlist/PublicVocabs_FLATLIST/PublicVocabs_FLATLIST";
import PublicVocabDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/PublicVocabDisplaySettings_MODAL/PublicVocabDisplaySettings_MODAL";
import CreatePublicVocab_MODAL from "@/src/features/2_vocabs/components/Modal/CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";
import UpdatePublicVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdatePublicVocab_MODAL/UpdatePublicVocab_MODAL";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";

export default function Explore_PAGE() {
  const router = useRouter();
  const { user } = USE_auth();
  const toast = useToast();
  const { languages } = USE_langs();

  const { z_lists, z_CREATE_privateVocab } = USE_zustand();

  const [displaySettings, SET_displaySettings] =
    useState<PublicVocabDisplaySettings_PROPS>({
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
    });

  const { FETCH_publicVocabs, ARE_publicVocabsFetching, publicVocabs_ERROR } =
    USE_fetchPublicVocabs();
  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);

  const { searched_VOCABS, search, SEARCH_vocabs, ARE_vocabsSearching } =
    USE_searchedVocabs(vocabs);
  const [
    SHOW_createPublicVocabModal,
    TOGGLE_createPublicVocabModal,
    SET_createPublicVocabModal,
  ] = USE_toggle(false);
  const [SHOW_saveVocabModal, TOGGLE_saveVocabModal, SET_saveVocabModal] =
    USE_toggle(false);

  const [targetSave_VOCAB, SET_targetSaveVocab] = useState<
    Vocab_MODEL | undefined
  >(undefined);

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<Vocab_MODEL | undefined>(
    undefined
  );
  const [SHOW_updateVocabModal, TOGGLE_updateVocabModal, SET_updateVocabModal] =
    USE_toggle(false);

  useEffect(() => {
    const fetch = async () => {
      const result = await FETCH_publicVocabs();
      if (result.success) {
        SET_vocabs(result.data);
      }
    };
    fetch();
  }, []);

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

  const PREPARE_toSaveVocab = (vocab: Vocab_MODEL) => {
    SET_targetSaveVocab(vocab);
    SET_saveVocabModal(true);
  };

  const [SHOW_deleteVocabModal, SET_deleteVocabModal] = useState(false);
  const [toDeleteVocab_ID, SET_toDeleteVocab] = useState<string | undefined>();
  const PREPARE_vocabDelete = (id: string) => {
    SET_toDeleteVocab(id);
    SET_deleteVocabModal(true);
  };

  const available_LANGS = useMemo(
    () => GET_uniqueLanguagesInAList(vocabs, languages),
    [vocabs]
  );

  return (
    <Page_WRAP>
      <PublicVocabs_HEADER />
      {vocabs && vocabs.length > 0 && (
        <PublicVocabs_SUBNAV
          {...{ search, TOGGLE_displaySettings, TOGGLE_createPublicVocabModal }}
          SET_search={SEARCH_vocabs}
          is_admin={user?.is_admin}
        />
      )}

      {ARE_vocabsSearching || ARE_publicVocabsFetching ? (
        <List_SKELETONS />
      ) : null}

      {vocabs && vocabs.length > 0 && searched_VOCABS.length > 0 ? (
        <PublicVocabs_FLATLIST
          vocabs={searched_VOCABS}
          highlightedVocab_ID={highlighted_ID}
          SHOW_bottomBtn={true}
          {...{
            PREPARE_vocabDelete,
            PREPARE_toSaveVocab,
            displaySettings,
            HANDLE_updateModal,
          }}
        />
      ) : (
        <EmptyFlatList_BOTTM
          // emptyBox_TEXT={t("label.thisListIsEmpty")}
          emptyBox_TEXT={
            search !== ""
              ? t("label.noVocabsFound")
              : t("label.thisListIsEmpty")
          }
          btn_TEXT={t("btn.createVocab")}
          btn_ACTION={() => {}}
        />
      )}
      <PublicVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        displaySettings={displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        SET_displaySettings={SET_displaySettings}
        available_LANGS={available_LANGS}
      />

      {user?.is_admin && (
        <CreatePublicVocab_MODAL
          IS_open={SHOW_createPublicVocabModal}
          TOGGLE_modal={() => TOGGLE_createPublicVocabModal()}
          onSuccess={(new_VOCAB: Vocab_MODEL) => {
            SET_vocabs((prev) => [new_VOCAB, ...prev]);

            SET_createPublicVocabModal(false);

            HIGHLIGHT_vocab(new_VOCAB.id);
            toast.show(t("notifications.vocabCreated"), {
              type: "green",
              duration: 3000,
            });
          }}
        />
      )}

      {user?.is_admin && (
        <UpdatePublicVocab_MODAL
          {...{ toUpdate_VOCAB }}
          IS_open={SHOW_updateVocabModal}
          TOGGLE_modal={() => TOGGLE_updateVocabModal()}
          onSuccess={(updated_VOCAB: Vocab_MODEL) => {
            SET_updateVocabModal(false);

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
          }}
        />
      )}

      <SavePublicVocabToList_MODAL
        vocab={targetSave_VOCAB}
        TOGGLE_open={TOGGLE_saveVocabModal}
        IS_open={SHOW_saveVocabModal}
        user={user}
        onSuccess={(saved_VOCAB: Vocab_MODEL) => {
          TOGGLE_saveVocabModal();
          z_CREATE_privateVocab(saved_VOCAB);
          toast.show(
            t("notifications.publicVocabSavedInAPrivateListPre") +
              `"${
                z_lists.find((l) => l.id === saved_VOCAB.list_id)?.name || ""
              }"` +
              t("notifications.publicVocabSavedInAPrivateListPost"),
            {
              type: "green",
              duration: 5000,
            }
          );
        }}
      />

      {user?.is_admin && (
        <DeleteVocab_MODAL
          user={user}
          IS_open={SHOW_deleteVocabModal}
          is_public={true}
          vocab_id={toDeleteVocab_ID}
          CLOSE_modal={() => SET_deleteVocabModal(false)}
          onSuccess={() => {
            SET_vocabs((prev) => prev.filter((v) => v.id !== toDeleteVocab_ID));
            SET_toDeleteVocab(undefined);
            toast.show(t("notifications.vocabDeleted"), {
              type: "green",
              duration: 5000,
            });
            SET_deleteVocabModal(false);
          }}
        />
      )}
    </Page_WRAP>
  );
}
