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
  DisplaySettings_PROPS,
  PublicVocabDisplaySettings_PROPS,
  Vocab_PROPS,
} from "@/src/db/props";
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
import { PublicVocabs_FLATLIST } from "@/src/features/2_vocabs/components/Flatlist/PublicVocabs_FLATLIST/PublicVocabs_FLATLIST";
import PublicVocabDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/PublicVocabDisplaySettings_MODAL/PublicVocabDisplaySettings_MODAL";
import CreatePublicVocab_MODAL from "@/src/features/2_vocabs/components/Modal/CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";
import UpdatePublicVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdatePublicVocab_MODAL/UpdatePublicVocab_MODAL";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";

export default function Explore_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [search, SET_search] = useState("");

  const { languages } = USE_langs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "save" },
    { name: "create" },
    { name: "delete" },
    { name: "update" },
  ]);

  const [
    SHOW_createPublicVocabModal,
    TOGGLE_createPublicVocabModal,
    SET_createPublicVocabModal,
  ] = USE_toggle(false);

  const [targetSave_VOCAB, SET_targetSaveVocab] = useState<
    Vocab_PROPS | undefined
  >(undefined);
  const [targetSave_TRS, SET_targetSaveTRS] = useState<
    Translation_MODEL[] | undefined
  >();

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const [toUpdate_TRS, SET_toUpdateTRS] = useState<
    Translation_MODEL[] | undefined
  >();
  const [toDeleteVocab_ID, SET_toDeleteVocab] = useState<string | undefined>();

  function HANDLE_updateModal({
    clear = false,
    vocab,
    trs,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
    trs?: Translation_MODEL[];
  }) {
    SET_toUpdateVocab(!clear && vocab ? vocab : undefined);
    SET_toUpdateTRS(!clear && trs ? trs : undefined);
    TOGGLE_modal("update");
  }

  const PREPARE_toSaveVocab = ({
    vocab,
    trs,
  }: {
    vocab: Vocab_PROPS;
    trs: Translation_MODEL[];
  }) => {
    SET_targetSaveVocab(vocab);
    SET_targetSaveTRS(trs);
    TOGGLE_modal("save");
  };

  const PREPARE_vocabDelete = (id: string) => {
    SET_toDeleteVocab(id);
    TOGGLE_modal("delete");
  };

  return (
    <Page_WRAP>
      <PublicVocabs_HEADER />
      <PublicVocabs_SUBNAV
        {...{ search, SET_search }}
        TOGGLE_createPublicVocabModal={() => TOGGLE_modal("create")}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        is_admin={user?.is_admin}
      />

      {/* {ARE_vocabsSearching || ARE_publicVocabsFetching ? (
        <List_SKELETONS />
      ) : null} */}

      <PublicVocabs_FLATLIST
        highlightedVocab_ID={highlighted_ID}
        SHOW_bottomBtn={true}
        {...{
          search,
          PREPARE_toSaveVocab,
          PREPARE_vocabDelete,
          HANDLE_updateModal,
        }}
      />

      {/* <PublicVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        displaySettings={displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        SET_displaySettings={SET_displaySettings}
        available_LANGS={available_LANGS}
      />  */}

      {user?.is_admin && (
        <CreatePublicVocab_MODAL
          IS_open={modal_STATES.create}
          TOGGLE_modal={() => TOGGLE_modal("create")}
          onSuccess={(new_VOCAB: Vocab_PROPS) => {
            TOGGLE_modal("create");
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
          {...{ toUpdate_VOCAB, toUpdate_TRS }}
          IS_open={modal_STATES.update}
          TOGGLE_modal={() => TOGGLE_modal("update")}
          onSuccess={(updated_VOCAB: Vocab_PROPS) => {
            TOGGLE_modal("update");
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
        trs={targetSave_TRS}
        TOGGLE_open={() => TOGGLE_modal("save")}
        IS_open={modal_STATES.save}
        user={user}
        onSuccess={() => {
          TOGGLE_modal("save");
          toast.show(t("notifications.savedVocab"), {
            type: "green",
            duration: 5000,
          });
        }}
      />

      {user?.is_admin && (
        <DeleteVocab_MODAL
          user={user}
          IS_open={modal_STATES.delete}
          is_public={true}
          vocab_id={toDeleteVocab_ID}
          CLOSE_modal={() => TOGGLE_modal("delete")}
          onSuccess={() => {
            SET_toDeleteVocab(undefined);
            toast.show(t("notifications.vocabDeleted"), {
              type: "green",
              duration: 5000,
            });
            TOGGLE_modal("delete");
          }}
        />
      )}
    </Page_WRAP>
  );
}
