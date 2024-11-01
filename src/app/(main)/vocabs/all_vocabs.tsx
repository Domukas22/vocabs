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

import React, { useEffect, useMemo, useState } from "react";
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
import USE_myVocabs from "@/src/features/1_lists/hooks/USE_myVocabs";
import FetchVocabs_QUERY from "@/src/features/2_vocabs/utils/FetchVocabs_QUERY";
import USE_zustand from "@/src/zustand";

import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";
import { Lists_DB, Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";
import { notEq } from "@nozbe/watermelondb/QueryDescription";
import {
  ActivityIndicator,
  Keyboard,
  View,
  TouchableWithoutFeedback,
} from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import { HEADER_MARGIN } from "@/src/constants/globalVars";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";
import Margin_SECTION from "@/src/components/Margin_SECTION";
import { USE_totalUserVocabs } from "@/src/hooks/USE_totalUserVocabs";

export default function AllVocabs_PAGE() {
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

  const totalListVocab_COUNT = USE_totalUserVocabs(z_user);

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

  const {
    vocabs,
    totalFilteredVocab_COUNT,
    HAS_reachedEnd,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_myVocabs({
    search: debouncedSearch,
    // list_id: "sda",
    user_id: z_user?.id,
    z_vocabDisplay_SETTINGS,
    fetchAll: true,
    paginateBy: 10,
  });

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME={"All my vocabs"}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        OPEN_listSettings={() => TOGGLE_modal("listSettings")}
        OPEN_create={() => TOGGLE_modal("createVocab")}
        {...{ search, SET_search, activeFilter_COUNT }}
      />
      <Margin_SECTION />

      <MyVocabs_FLATLIST
        {...{ vocabs }}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            vocabResults_COUNT={totalFilteredVocab_COUNT || 0}
            list_NAME={"All vocabs"}
            totalVocabs={totalListVocab_COUNT ? totalListVocab_COUNT : 0}
            {...{
              search,
              z_vocabDisplay_SETTINGS,
              z_SET_vocabDisplaySettings,
            }}
          />
        }
        listFooter_EL={
          <BottomAction_SECTION
            {...{
              search,
              LOAD_more,
              IS_loadingMore,
              activeFilter_COUNT,
              totalFilteredResults_COUNT: totalFilteredVocab_COUNT,
              HAS_reachedEnd,
            }}
            RESET_search={() => SET_search("")}
            RESET_filters={() =>
              z_SET_vocabDisplaySettings({
                langFilters: [],
                difficultyFilters: [],
              })
            }
          />
        }
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
          ADD_toDisplayed(new_VOCAB);
          toast.show(t("notifications.vocabCreated"), {
            type: "green",
            duration: 3000,
          });
        }}
      />
      <UpdateMyVocab_MODAL
        toUpdate_VOCAB={toUpdate_VOCAB}
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
      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={[]}
      />

      <DeleteVocab_MODAL
        IS_open={modal_STATES.delete}
        vocab_id={delete_ID || ""}
        CLOSE_modal={() => TOGGLE_modal("delete")}
        onSuccess={() => {
          toast.show(t("notifications.vocabDeleted"), {
            type: "green",
            duration: 5000,
          });
          REMOVE_fromDisplayed(delete_ID);
          TOGGLE_modal("delete");
        }}
      />
    </Page_WRAP>
  );
}
