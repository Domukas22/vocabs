//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import {
  CreateMyVocab_MODAL,
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
import USE_observedVocabs from "@/src/features/1_lists/hooks/USE_observeVocabs";
import FetchVocabs_QUERY from "@/src/features/2_vocabs/utils/FetchVocabs_QUERY";
import USE_zustand from "@/src/zustand";

import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";
import { Lists_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";

function _AllMyVocabs_PAGE({
  totalVocab_COUNT = 0,
}: {
  totalVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();

  const { z_user, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } =
    USE_zustand();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const [delete_ID, SET_deleteId] = useState("");

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

  const vocabs = USE_observedVocabs({
    search: debouncedSearch,
    user_id: z_user?.id,
    fetchAll: true,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="All my vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        OPEN_create={() => TOGGLE_modal("createVocab")}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <MyVocabs_FLATLIST
        {...{ vocabs }}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            list_NAME="All my vocabs"
            totalVocabs={totalVocab_COUNT ? totalVocab_COUNT : 0}
            {...{ search, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings }}
          />
        }
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
        initial_LIST={undefined}
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
        list={undefined}
        user={z_user}
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
        collectedLang_IDS={[]}
      />

      <DeleteVocab_MODAL
        user={z_user}
        IS_open={modal_STATES.delete}
        is_public={false}
        vocab_id={delete_ID || ""}
        list_id={""}
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

export default function AllMyVocabs_PAGE() {
  const { z_user } = USE_zustand();

  const enhance = withObservables([], () => ({
    totalVocab_COUNT: z_user?.totalVocab_COUNT
      ? z_user?.totalVocab_COUNT
      : undefined,
  }));

  const EnhancedPage = enhance(_AllMyVocabs_PAGE);

  // Render the enhanced page
  return <EnhancedPage />;
}
