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
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import { List_PROPS, DisplaySettings_PROPS, Vocab_PROPS } from "@/src/db/props";
import React, { useEffect, useState } from "react";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { useTranslation } from "react-i18next";
import { USE_langs } from "@/src/context/Langs_CONTEXT";

import { useToast } from "react-native-toast-notifications";
import USE_zustand from "@/src/zustand";
import UpdateMyVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";

export default function SingleList_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [search, SET_search] = useState("");
  const { selected_LIST } = USE_selectedList();

  const [vocabs, SET_vocabs] = useState<Vocab_PROPS[]>(
    selected_LIST?.vocabs || []
  );
  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const [toUpdate_TRS, SET_toUpdateTRS] = useState<
    Translation_MODEL[] | undefined
  >();

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const {
    isHighlighted: IS_listNameHighlighted,
    highlight: HIGHLIGHT_listName,
  } = USE_highlightBoolean();

  const { IS_createModalOpen, TOGGLE_createVocabModal, onCreate_SUCCESS } =
    USE_createVocabModal({ selected_LIST, HIGHLIGHT_vocab });

  const { IS_updateModalOpen, TOGGLE_updateVocabModal, onUpdate_SUCCESS } =
    USE_updateVocabModal({ selected_LIST, HIGHLIGHT_vocab });

  const {
    IS_deleteModalOpen,
    TOGGLE_deleteVocabModal,
    onDelete_SUCCESS,
    delete_ID,
    SET_deleteId,
  } = USE_deleteVocabModal({ selected_LIST });

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "listSettings" },
  ]);

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
    TOGGLE_updateVocabModal();
  }

  return (
    <Page_WRAP>
      <MyVocabs_HEADER
        list_NAME={selected_LIST?.name && selected_LIST.name}
        btnBack_ACTION={() => router.back()}
        btnDots_ACTION={() => TOGGLE_modal("listSettings")}
        IS_listNameHighlighted={IS_listNameHighlighted}
      />
      <MyVocabs_SUBNAV
        {...{ search, SET_search }}
        vocab_COUNT={vocabs?.length || 0}
        onPlusIconPress={() => TOGGLE_createVocabModal()}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      <MyVocabs_FLATLIST
        list_id={selected_LIST?.id || ""}
        SHOW_bottomBtn={true}
        TOGGLE_createVocabModal={() => TOGGLE_createVocabModal()}
        PREPARE_vocabDelete={(id: string) => {
          SET_deleteId(id);
          TOGGLE_deleteVocabModal();
        }}
        {...{
          search,
          highlightedVocab_ID: highlighted_ID,
          HANDLE_updateModal,
        }}
      />
      <CreateMyVocab_MODAL
        IS_open={IS_createModalOpen}
        initial_LIST={selected_LIST}
        TOGGLE_modal={TOGGLE_createVocabModal}
        onSuccess={(new_VOCAB: Vocab_PROPS) => onCreate_SUCCESS(new_VOCAB)}
      />
      <UpdateMyVocab_MODAL
        toUpdate_VOCAB={toUpdate_VOCAB}
        toUpdate_TRS={toUpdate_TRS}
        list={selected_LIST}
        IS_open={IS_updateModalOpen}
        TOGGLE_modal={TOGGLE_updateVocabModal}
        onSuccess={onUpdate_SUCCESS}
      />
      {/* <MyVocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        vocabs={vocabs}
      /> */}

      {/* <
      
      <ListSettings_MODAL
        list={selected_LIST}
        open={modal_STATES.listSettings}
        TOGGLE_open={() => TOGGLE_modal("listSettings")}
        user_id={user?.id}
        backToIndex={() => router.back()}
        HIGHLIGHT_listName={HIGHLIGHT_listName}
      />
    */}
      <DeleteVocab_MODAL
        user={user}
        IS_open={IS_deleteModalOpen}
        is_public={false}
        vocab_id={delete_ID || ""}
        list_id={selected_LIST?.id}
        CLOSE_modal={TOGGLE_deleteVocabModal}
        onSuccess={onDelete_SUCCESS}
      />
    </Page_WRAP>
  );
}

function USE_createVocabModal({
  selected_LIST,
  HIGHLIGHT_vocab,
}: {
  selected_LIST: List_PROPS;
  HIGHLIGHT_vocab: (id: string) => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const { z_CREATE_privateVocab, z_lists } = USE_zustand();
  const [IS_createModalOpen, SET_createModalOpen] = useState(false);

  function TOGGLE_createVocabModal() {
    console.log("fire");
    SET_createModalOpen(!IS_createModalOpen);
  }

  function onCreate_SUCCESS(new_VOCAB: Vocab_PROPS) {
    z_CREATE_privateVocab(new_VOCAB);
    TOGGLE_createVocabModal();

    if (new_VOCAB.list_id === selected_LIST.id) {
      HIGHLIGHT_vocab(new_VOCAB.id);
      toast.show(t("notifications.vocabCreated"), {
        type: "green",
        duration: 3000,
      });
    } else {
      const target_LIST =
        z_lists.find((l) => l.id === new_VOCAB.list_id)?.name || "";
      toast.show(
        `${t(
          "notifications.vocabCreatedInAnotherListPre"
        )} "${target_LIST}" ${t(
          "notifications.vocabCreatedInAnotherListPost"
        )}`,
        { type: "green", duration: 5000 }
      );
    }
  }

  return { IS_createModalOpen, TOGGLE_createVocabModal, onCreate_SUCCESS };
}

function USE_updateVocabModal({
  selected_LIST,
  HIGHLIGHT_vocab,
}: {
  selected_LIST: List_PROPS;
  HIGHLIGHT_vocab: (id: string) => void;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const {
    z_UPDATE_privateVocab,
    z_lists,
    z_printed_VOCABS,
    z_SET_printedVocabs,
  } = USE_zustand();
  const [IS_updateModalOpen, SET_updateModalOpen] = useState(false);

  // Function to toggle the update vocab modal
  function TOGGLE_updateVocabModal() {
    SET_updateModalOpen(!IS_updateModalOpen);
  }

  // Function called upon successful update of a vocab
  function onUpdate_SUCCESS(updated_VOCAB: Vocab_PROPS) {
    z_UPDATE_privateVocab(updated_VOCAB);
    TOGGLE_updateVocabModal();

    if (updated_VOCAB.list_id === selected_LIST.id) {
      HIGHLIGHT_vocab(updated_VOCAB.id);
      toast.show(t("notifications.vocabUpdated"), {
        type: "green",
        duration: 3000,
      });
    } else {
      const target_LIST =
        z_lists.find((l) => l.id === updated_VOCAB.list_id)?.name || "";
      z_SET_printedVocabs(
        z_printed_VOCABS.filter((vocab) => vocab.id !== updated_VOCAB.id)
      );
      toast.show(
        `${t(
          "notifications.vocabUpdatedInAnotherListPre"
        )} "${target_LIST}" ${t(
          "notifications.vocabUpdatedInAnotherListPost"
        )}`,
        { type: "green", duration: 5000 }
      );
    }
  }

  return { IS_updateModalOpen, TOGGLE_updateVocabModal, onUpdate_SUCCESS };
}
function USE_deleteVocabModal({
  selected_LIST,
}: {
  selected_LIST: List_PROPS;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const { z_DELETE_privateVocab } = USE_zustand();
  const [IS_deleteModalOpen, SET_deleteModalOpen] = useState(false);
  const [delete_ID, SET_deleteId] = useState<string | undefined>();

  // Function to toggle the delete vocab modal
  function TOGGLE_deleteVocabModal() {
    SET_deleteModalOpen(!IS_deleteModalOpen);
  }

  // Function called upon successful deletion of a vocab
  function onDelete_SUCCESS() {
    if (delete_ID) {
      z_DELETE_privateVocab(selected_LIST.id, delete_ID);
      toast.show(t("notifications.vocabDeleted"), {
        type: "green",
        duration: 5000,
      });

      TOGGLE_deleteVocabModal(); // Close the modal
    }
  }

  return {
    IS_deleteModalOpen,
    TOGGLE_deleteVocabModal,
    delete_ID,
    SET_deleteId,
    onDelete_SUCCESS,
  };
}
