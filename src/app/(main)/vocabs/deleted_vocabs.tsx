//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import List_HEADER from "@/src/components/1_grouped/headers/listPage/List_HEADER";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import {
  MyVocabs_FLATLIST,
  VocabsFlatlistHeader_SECTION,
  ReviveDeletedVocab_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import {
  USE_myTotalVocabCount,
  USE_vocabs,
} from "@/src/features/vocabs/functions";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";

export default function DeletedVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();

  const { z_user, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } =
    USE_zustand();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const [targetRevive_VOCAB, SET_targetReviveVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const [targetDelete_VOCAB, SET_targetDeleteVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const totalListVocab_COUNT = USE_myTotalVocabCount(z_user);

  const { modals } = USE_modalToggles([
    "reviveVocab",
    "deleteVocab",
    "displaySettings",
  ]);

  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_MODEL | undefined
  >();

  const {
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
    REMOVE_fromDisplayed,
  } = USE_vocabs({
    type: "deletedVocabs",
    search: debouncedSearch,
    user_id: z_user?.id,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME="Deleted vocabs"
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <MyVocabs_FLATLIST
        {...{ vocabs, IS_searching }}
        type="delete"
        HANDLE_updateModal={() => {}}
        highlightedVocab_ID={highlighted_ID}
        PREPARE_vocabDelete={(vocab: Vocab_MODEL) => {
          SET_targetDeleteVocab(vocab);
          modals.deleteVocab.set(true);
        }}
        SELECT_forRevival={(vocab: Vocab_MODEL) => {
          SET_targetReviveVocab(vocab);
          modals.reviveVocab.set(true);
        }}
        error={fetchVocabs_ERROR}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME="Deleted vocabs"
            vocabResults_COUNT={totalFilteredVocab_COUNT}
            z_vocabDisplay_SETTINGS={z_vocabDisplay_SETTINGS}
            z_SET_vocabDisplaySettings={z_SET_vocabDisplaySettings}
          />
        }
        listFooter_EL={
          <BottomAction_BLOCK
            type="vocabs"
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

      <Portal>
        <ReviveDeletedVocab_MODAL
          vocab={targetRevive_VOCAB}
          IS_open={modals.reviveVocab.IS_open}
          onSuccess={(new_VOCAB: Vocab_MODEL) => {
            modals.reviveVocab.set(false);

            HIGHLIGHT_vocab(new_VOCAB.id);
            REMOVE_fromDisplayed(new_VOCAB.id);
            toast.show(t("notifications.vocabRevived"), {
              type: "success",
              duration: 3000,
            });
          }}
          TOGGLE_open={() => modals.reviveVocab.set(false)}
        />

        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
          collectedLang_IDS={[]}
        />
      </Portal>
    </>
  );
}
