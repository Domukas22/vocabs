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
import {
  List_MODEL,
  DisplaySettings_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
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

export default function SingleList_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [search, SET_search] = useState("");
  const { selected_LIST } = USE_selectedList();

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>(
    selected_LIST?.vocabs || []
  );
  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const [toDeleteVocab_ID, SET_toDeleteVocab] = useState<string | undefined>();

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const {
    isHighlighted: IS_listNameHighlighted,
    highlight: HIGHLIGHT_listName,
  } = USE_highlightBoolean();

  const { IS_createModalOpen, TOGGLE_createVocabModal, onCreate_SUCCESS } =
    USE_createVocabModal({ selected_LIST, HIGHLIGHT_vocab });

  const {
    z_lists,
    z_CREATE_privateVocab,
    z_DELETE_privateVocab,
    z_UPDATE_privateVocab,
  } = USE_zustand();

  useEffect(() => {
    console.log("hello");
  }, []);

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "listSettings" },
    { name: "create" },
    { name: "update" },
    { name: "delete" },
  ]);

  const [displaySettings, SET_displaySettings] =
    useState<DisplaySettings_PROPS>({
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
      sorting: "difficulty",
      sortDirection: "ascending",
      difficultyFilters: [],
      langFilters: [],
    });

  function HANDLE_updateModal({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) {
    SET_toUpdateVocab(!clear && vocab ? vocab : undefined);
    TOGGLE_modal("update");
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
        activeFitlers={
          displaySettings.difficultyFilters.length +
          displaySettings.langFilters.length
        }
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      <MyVocabs_FLATLIST
        all_VOCABS={vocabs}
        SHOW_bottomBtn={true}
        TOGGLE_createVocabModal={() => TOGGLE_createVocabModal()}
        PREPARE_vocabDelete={(id: string) => {
          SET_toDeleteVocab(id);
          TOGGLE_modal("delete");
        }}
        {...{
          search,
          highlightedVocab_ID: highlighted_ID,
          HANDLE_updateModal,
          displaySettings,
        }}
      />
      <MyVocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
        vocabs={vocabs}
      />

      <CreateMyVocab_MODAL
        IS_open={IS_createModalOpen}
        initial_LIST={selected_LIST}
        TOGGLE_modal={TOGGLE_createVocabModal}
        onSuccess={(new_VOCAB: Vocab_MODEL) => onCreate_SUCCESS(new_VOCAB)}
      />
      <UpdateMyVocab_MODAL
        {...{ toUpdate_VOCAB }}
        IS_open={modal_STATES.update}
        initial_LIST={selected_LIST}
        TOGGLE_modal={() => TOGGLE_modal("update")}
        onSuccess={(updated_VOCAB: Vocab_MODEL) => {
          z_UPDATE_privateVocab(updated_VOCAB);
          TOGGLE_modal("update");

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
            const target_LIST =
              z_lists.find((l) => l.id === updated_VOCAB.list_id)?.name || "";
            toast.show(
              t("notifications.vocabUpdatedInAnotherListPre") +
                `"${target_LIST}"` +
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
        open={modal_STATES.listSettings}
        TOGGLE_open={() => TOGGLE_modal("listSettings")}
        user_id={user?.id}
        backToIndex={() => router.back()}
        HIGHLIGHT_listName={HIGHLIGHT_listName}
      />
      <DeleteVocab_MODAL
        user={user}
        IS_open={modal_STATES.delete}
        is_public={false}
        vocab_id={toDeleteVocab_ID}
        list_id={selected_LIST?.id}
        CLOSE_modal={() => TOGGLE_modal("delete")}
        onSuccess={() => {
          SET_vocabs((prev) => prev.filter((v) => v.id !== toDeleteVocab_ID));
          z_DELETE_privateVocab(selected_LIST?.id, toDeleteVocab_ID || "");
          SET_toDeleteVocab(undefined);
          toast.show(t("notifications.vocabDeleted"), {
            type: "green",
            duration: 5000,
          });
          TOGGLE_modal("delete");
        }}
      />
    </Page_WRAP>
  );
}

function USE_createVocabModal({
  selected_LIST,
  HIGHLIGHT_vocab,
}: {
  selected_LIST: List_MODEL;
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

  function onCreate_SUCCESS(new_VOCAB: Vocab_MODEL) {
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
