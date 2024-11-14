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

import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { PUSH_changes, sync, USE_sync_2 } from "@/src/db/sync";
import Btn from "@/src/components/Btn/Btn";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import USE_displaySettings from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import { USE_vocabs } from "@/src/features/1_lists/hooks/USE_vocabs";

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
import Vocabs_FLATLIST from "@/src/features/2_vocabs/components/Vocabs_FLATLIST";
import { FlashList, FlashListProps } from "@shopify/flash-list";

function __SingleList_PAGE({
  selected_LIST = undefined,
  totalListVocab_COUNT = 0,
}: {
  selected_LIST: List_MODEL | undefined;
  totalListVocab_COUNT: number | undefined;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { list_id } = useLocalSearchParams();

  const { z_user, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } =
    USE_zustand();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const list_REF = useRef<FlashList<any>>(null);

  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

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
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_vocabs({
    type: "byTargetList",
    targetList_ID: typeof list_id === "string" ? list_id : "",
    search: debouncedSearch,
    user_id: z_user?.id,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  const { sync: sync_2 } = USE_sync_2();

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME={selected_LIST?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        OPEN_listSettings={() => TOGGLE_modal("listSettings")}
        OPEN_create={() => TOGGLE_modal("createVocab")}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <Btn text="Sync all" onPress={async () => await sync_2("all", z_user)} />
      <Btn
        text="Sync updates"
        onPress={async () => await sync_2("updates", z_user)}
      />
      <Vocabs_FLATLIST
        {...{ vocabs, IS_searching, HANDLE_updateModal }}
        type="normal"
        highlightedVocab_ID={highlighted_ID}
        PREPARE_vocabDelete={(vocab: Vocab_MODEL) => {
          SET_targetDeleteVocab(vocab);
          TOGGLE_modal("delete");
        }}
        _ref={list_REF}
        error={fetchVocabs_ERROR}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME={selected_LIST?.name}
            vocabResults_COUNT={totalFilteredVocab_COUNT}
            z_vocabDisplay_SETTINGS={z_vocabDisplay_SETTINGS}
            z_SET_vocabDisplaySettings={z_SET_vocabDisplaySettings}
          />
        }
        listFooter_EL={
          <BottomAction_SECTION
            type="vocabs"
            createBtn_ACTION={() => TOGGLE_modal("create")}
            search={search}
            IS_debouncing={IS_debouncing}
            IS_loadingMore={IS_loadingMore}
            HAS_reachedEnd={HAS_reachedEnd}
            activeFilter_COUNT={activeFilter_COUNT}
            totalFilteredResults_COUNT={totalFilteredVocab_COUNT}
            LOAD_more={LOAD_more}
            RESET_search={() => SET_search("")}
            RESET_filters={() =>
              z_SET_vocabDisplaySettings({
                langFilters: [],
                difficultyFilters: [],
              })
            }
          />
        }
      />

      <CreateMyVocab_MODAL
        IS_open={modal_STATES.createVocab}
        initialList_ID={selected_LIST?.id}
        TOGGLE_modal={() => TOGGLE_modal("createVocab")}
        onSuccess={(new_VOCAB: Vocab_MODEL) => {
          TOGGLE_modal("createVocab");
          HIGHLIGHT_vocab(new_VOCAB.id);
          ADD_toDisplayed(new_VOCAB);
          list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
          toast.show(t("notifications.vocabCreated"), {
            type: "success",
            duration: 3000,
          });
        }}
      />
      <UpdateMyVocab_MODAL
        toUpdate_VOCAB={toUpdate_VOCAB}
        IS_open={modal_STATES.update}
        TOGGLE_modal={() => TOGGLE_modal("update")}
        onSuccess={(updated_VOCAB: Vocab_MODEL) => {
          TOGGLE_modal("update");
          HIGHLIGHT_vocab(updated_VOCAB.id);

          toast.show(t("notifications.vocabUpdated"), {
            type: "success",
            duration: 3000,
          });
        }}
      />
      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={selected_LIST?.collected_lang_ids?.split(",") || []}
      />

      <ListSettings_MODAL
        selected_LIST={selected_LIST}
        open={modal_STATES.listSettings}
        TOGGLE_open={() => TOGGLE_modal("listSettings")}
        backToIndex={() => router.back()}
      />

      <DeleteVocab_MODAL
        IS_open={modal_STATES.delete}
        vocab={targetDelete_VOCAB}
        CLOSE_modal={() => TOGGLE_modal("delete")}
        onSuccess={() => {
          toast.show(t("notifications.vocabDeleted"), {
            type: "success",
            duration: 5000,
          });
          REMOVE_fromDisplayed(targetDelete_VOCAB?.id || "");
          TOGGLE_modal("delete");
        }}
      />
    </Page_WRAP>
  );
}

export default function SingleList_PAGE() {
  const { list_id } = useLocalSearchParams();
  // const [list, setList] = useState<List_MODEL | null>(null);

  // Fetch the list asynchronously based on `list_id`
  // useEffect(() => {
  //   const fetchList = async () => {
  //     if (typeof list_id !== "string") {
  //       return;
  //     }

  //     const foundList = await Lists_DB.find(list_id);
  //     setList(foundList);
  //   };

  //   fetchList();
  // }, [list_id]);

  // // Observe the selected list
  // const listObservable = USE_observeList(
  //   typeof list_id === "string" ? list_id : ""
  // );

  // Use withObservables to pass the observed list and computed total count to the page
  const enhance = withObservables(["selected_LIST"], ({ selected_LIST }) => ({
    // selected_LIST: list ? list : undefined,
    selected_LIST: Lists_DB.findAndObserve(
      typeof list_id === "string" ? list_id : ""
    ),
    // totalListVocab_COUNT: list?.vocab_COUNT ? list?.vocab_COUNT : undefined,
  }));

  const EnhancedPage = enhance(__SingleList_PAGE);

  // Render the enhanced page
  return <EnhancedPage totalListVocab_COUNT={0} />;
}
