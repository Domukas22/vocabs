//
//
//

import Page_WRAP from "@/src/components/1_grouped/Page_WRAP/Page_WRAP";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import List_MODEL from "@/src/db/models/List_MODEL";
import { useTranslation } from "react-i18next";
import React from "react";
import { useToast } from "react-native-toast-notifications";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import List_HEADER from "@/src/components/1_grouped/headers/listPage/List_HEADER";
import { CopyListAndVocabs_MODAL } from "@/src/features/lists/components";
import {
  USE_fetchOnePublicList,
  USE_copyListAndItsVocabs,
  USE_incrementPublicListSavedCount,
} from "@/src/features/lists/functions";
import {
  ExploreVocabs_FLATLIST,
  VocabsFlatlistHeader_SECTION,
  SavePublicVocabToList_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { USE_supabaseVocabs } from "@/src/features/vocabs/functions";
import { USE_showListHeaderTitle, USE_debounceSearch } from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";

export default function PublicListVocabs_PAGE() {
  const toast = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { publicList_id } = useLocalSearchParams();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { list, IS_listFetching, listFetch_ERROR } = USE_fetchOnePublicList(
    typeof publicList_id === "string" ? publicList_id : ""
  );

  const { modals } = USE_modalToggles(["saveList", "displaySettings"]);

  const {
    COPY_listAndVocabs,
    IS_copyingList,
    copyList_ERROR,
    RESET_copyListError,
  } = USE_copyListAndItsVocabs();

  const {
    INCREMENT_listSavedCount,
    IS_incrementingSavedCount,
    incrementSavedCount_ERROR,
    RESET_incrementSavedCountError,
  } = USE_incrementPublicListSavedCount();

  const copy = async () => {
    if (!list || IS_copyingList) return;
    const new_LIST = await COPY_listAndVocabs({
      list,
      user: z_user,
      onSuccess: (new_LIST: List_MODEL) => {
        modals.saveList.set(false);

        toast.show(t("notifications.listAndVocabsCopied"), {
          type: "success",
          duration: 5000,
        });
      },
    });

    if (new_LIST.success && typeof list?.id === "string") {
      const incrementResult = await INCREMENT_listSavedCount({
        list_id: list?.id,
        onSuccess: () => {},
      });

      if (!incrementResult.success) {
        console.error(incrementResult.msg);
        return;
      }
    }

    if (!new_LIST.success) {
      console.error(new_LIST.msg); // Log internal message for debugging.
    }
  };

  const collectedLangIds = useMemo(() => {
    // infinite loop occurs if not defined
    return list?.collected_lang_ids?.split(",") || [];
  }, [list?.collected_lang_ids]);

  const {
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
  } = USE_supabaseVocabs({
    type: "byTargetList",
    targetList_ID: typeof publicList_id === "string" ? publicList_id : "",
    search: debouncedSearch,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME={list?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SAVE_list={() => modals.saveList.set(true)}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <ExploreVocabs_FLATLIST
        {...{ vocabs, IS_searching }}
        error={fetchVocabs_ERROR}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          modals.saveList.set(false);
        }}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME={list?.name}
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

      {/* ------------------------------------------------------------------ MODALS ------------------------------------------------------------------ */}
      <SavePublicVocabToList_MODAL
        vocab={target_VOCAB}
        IS_open={modals.saveList.IS_open}
        onSuccess={() => {
          modals.saveList.set(false);
          toast.show(t("notifications.savedVocab"), {
            type: "success",
            duration: 3000,
          });
        }}
        TOGGLE_open={() => modals.saveList.set(false)}
      />

      <VocabDisplaySettings_MODAL
        open={modals.displaySettings.IS_open}
        TOGGLE_open={() => modals.displaySettings.set(false)}
        collectedLang_IDS={collectedLangIds}
        HAS_difficulties={false}
      />
      <CopyListAndVocabs_MODAL
        error={copyList_ERROR}
        IS_open={modals.saveList.IS_open}
        IS_copying={IS_copyingList}
        copy={copy}
        RESET_error={RESET_copyListError}
        CLOSE_modal={() => modals.saveList.set(false)}
      />
    </>
  );
}
