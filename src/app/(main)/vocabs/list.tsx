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
import Btn from "@/src/components/Btn/Btn";

export default function SingleList_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [search, SET_search] = useState("");
  const { z_display_SETTINGS } = USE_zustand();

  const { selected_LIST } = USE_selectedList();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "listSettings" },
    { name: "create" },
    { name: "delete" },
    { name: "update" },
  ]);

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

  const [delete_ID, SET_deleteId] = useState("");

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
        onPlusIconPress={() => TOGGLE_modal("create")}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      <MyVocabs_FLATLIST
        filters={{
          search: search,
          list: selected_LIST,
          is_public: false,
          difficultyFilters: z_display_SETTINGS.difficultyFilters || [],
          langFilters: z_display_SETTINGS.langFilters || [],
          sorting: z_display_SETTINGS.sorting,
          sortDirection: z_display_SETTINGS.sortDirection,
        }}
        list_id={selected_LIST?.id || ""}
        SHOW_bottomBtn={true}
        TOGGLE_createVocabModal={() => TOGGLE_modal("create")}
        PREPARE_vocabDelete={(id: string) => {
          SET_deleteId(id);
          TOGGLE_modal("delete");
        }}
        {...{
          search,
          highlightedVocab_ID: highlighted_ID,
          HANDLE_updateModal,
        }}
      />
      <CreateMyVocab_MODAL
        IS_open={modal_STATES.create}
        initial_LIST={selected_LIST}
        TOGGLE_modal={() => TOGGLE_modal("create")}
        onSuccess={(new_VOCAB: Vocab_MODEL) => {
          TOGGLE_modal("create");
          HIGHLIGHT_vocab(new_VOCAB.id);
          toast.show(t("notifications.vocabCreated"), {
            type: "green",
            duration: 3000,
          });
        }}
      />
      <UpdateMyVocab_MODAL
        toUpdate_VOCAB={toUpdate_VOCAB}
        toUpdate_TRS={toUpdate_TRS}
        list={selected_LIST}
        IS_open={modal_STATES.update}
        TOGGLE_modal={() => TOGGLE_modal("update")}
        onSuccess={(updated_VOCAB: Vocab_MODEL) => {
          TOGGLE_modal("update");
          HIGHLIGHT_vocab(updated_VOCAB.id);
          toast.show(t("notifications.vocabUpdated"), {
            type: "green",
            duration: 3000,
          });
        }}
      />
      <MyVocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        list_id={selected_LIST?.id || ""}
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
        vocab_id={delete_ID || ""}
        list_id={selected_LIST?.id}
        CLOSE_modal={() => TOGGLE_modal("delete")}
        onSuccess={() => {
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
