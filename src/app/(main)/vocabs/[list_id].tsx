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
import { useLocalSearchParams, useRouter } from "expo-router";

import React, { useEffect, useState } from "react";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";

import UpdateMyVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";

import { withObservables } from "@nozbe/watermelondb/react";
import { USE_observeList } from "@/src/features/1_lists/hooks/USE_observeList";
import { sync } from "@/src/db/sync";
import Btn from "@/src/components/Btn/Btn";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import USE_displaySettings from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import USE_observedVocabs, {
  USE_observeVocabs,
} from "@/src/features/1_lists/hooks/USE_observeVocabs";
import FetchVocabs_QUERY from "@/src/features/2_vocabs/utils/FetchVocabs_QUERY";
import USE_zustand from "@/src/zustand";
import USE_aggregateVocabLangs from "@/src/features/2_vocabs/hooks/USE_aggregateVocabLangs";

function __SingleList_PAGE({
  selected_LIST = undefined,
}: {
  selected_LIST: List_MODEL | undefined;
}) {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [search, SET_search] = useState("");

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "listSettings" },
    { name: "createVocab" },
    { name: "delete" },
    { name: "update" },
  ]);

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const [delete_ID, SET_deleteId] = useState("");

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
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const vocabs = USE_observedVocabs({
    search,
    list_id: selected_LIST?.id,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <Page_WRAP>
      <MyVocabs_HEADER
        list_NAME={selected_LIST?.name || ""}
        undertextGreen={
          selected_LIST?.type === "shared" ? t("undertext.shared") : ""
        }
        btnBack_ACTION={() => router.back()}
        btnDots_ACTION={() => TOGGLE_modal("listSettings")}
      />
      {/* <Styled_TEXT>{list?.type}</Styled_TEXT> */}
      <MyVocabs_SUBNAV
        {...{ search, SET_search }}
        onPlusIconPress={() => TOGGLE_modal("createVocab")}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      <MyVocabs_FLATLIST
        {...{ vocabs }}
        SHOW_bottomBtn={true}
        TOGGLE_createVocabModal={() => TOGGLE_modal("createVocab")}
        PREPARE_vocabDelete={(id: string) => {
          SET_deleteId(id);
          TOGGLE_modal("delete");
        }}
        {...{
          search,
          highlightedVocab_ID: highlighted_ID || "",
          HANDLE_updateModal,
        }}
      />
      <CreateMyVocab_MODAL
        IS_open={modal_STATES.createVocab}
        initial_LIST={selected_LIST}
        TOGGLE_modal={() => TOGGLE_modal("createVocab")}
        onSuccess={(new_VOCAB: Vocab_MODEL) => {
          TOGGLE_modal("createVocab");
          HIGHLIGHT_vocab(new_VOCAB.id);
          toast.show(t("notifications.vocabCreated"), {
            type: "green",
            duration: 3000,
          });
        }}
      />
      <UpdateMyVocab_MODAL
        toUpdate_VOCAB={toUpdate_VOCAB}
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
      {/* <MyVocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        list_id={selected_LIST?.id}
      /> */}
      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={selected_LIST?.collected_lang_ids}
      />

      <ListSettings_MODAL
        selected_LIST={selected_LIST}
        open={modal_STATES.listSettings}
        TOGGLE_open={() => TOGGLE_modal("listSettings")}
        user_id={user?.id}
        backToIndex={() => router.back()}
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

export default function SingleList_PAGE() {
  const { list_id } = useLocalSearchParams();

  const listObservable = USE_observeList(
    typeof list_id === "string" ? list_id : ""
  );

  const enhance = withObservables(["selected_LIST"], ({ selected_LIST }) => ({
    selected_LIST,
  }));

  const EnhancedPage = enhance(__SingleList_PAGE);

  // Pass the observable to the EnhancedPage
  return <EnhancedPage selected_LIST={listObservable} />;
}
