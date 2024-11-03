//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { useTranslation } from "react-i18next";
import React from "react";
import { useToast } from "react-native-toast-notifications";

import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import USE_supabaseVocabsOfAList from "@/src/features/2_vocabs/hooks/USE_supabaseVocabsOfAList";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_fetchOnePublicList from "@/src/features/2_vocabs/hooks/USE_fetchOnePublicList";

import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";

import ExploreVocabs_FLATLIST from "@/src/features/2_vocabs/components/ExploreVocabs_FLATLIST";

import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";
import USE_copyListAndItsVocabs from "@/src/features/1_lists/hooks/USE_copyListAndItsVocabs";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import CopyListAndVocabs_MODAL from "@/src/features/1_lists/components/CopyListAndVocabs_MODAL";
import List_HEADER from "@/src/components/Header/List_HEADER";
import USE_getActiveFilterCount from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/utils/USE_getActiveFilterCount";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import USE_incrementListSavedCount from "@/src/features/1_lists/hooks/USE_incrementListSavedCount";
import Btn from "@/src/components/Btn/Btn";
import { supabase } from "@/src/lib/supabase";
import USE_showListHeaderTitle from "@/src/hooks/USE_showListHeaderTitle";

import USE_supabaseVocabs from "@/src/hooks/USE_supabaseVocabs";
import BottomAction_SECTION from "@/src/components/BottomAction_SECTION";

export default function PublicListVocabs_PAGE() {
  const toast = useToast();
  const { z_user } = USE_zustand();
  const router = useRouter();
  const { t } = useTranslation();
  const { publicList_id } = useLocalSearchParams();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const activeFilter_COUNT = USE_getActiveFilterCount(z_vocabDisplay_SETTINGS);

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "save" },
    { name: "displaySettings" },
    { name: "saveList" },
  ]);

  const { list, IS_listFetching, listFetch_ERROR } = USE_fetchOnePublicList(
    typeof publicList_id === "string" ? publicList_id : ""
  );

  const { showTitle, handleScroll } = USE_showListHeaderTitle();

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
  } = USE_incrementListSavedCount();

  const copy = async () => {
    if (!list || IS_copyingList) return;
    const new_LIST = await COPY_listAndVocabs({
      list,
      user: z_user,
      onSuccess: (new_LIST: List_MODEL) => {
        TOGGLE_modal("saveList");
        toast.show(t("notifications.listAndVocabsCopied"), {
          type: "green",
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
  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    totalFilteredVocab_COUNT,
  } = USE_supabaseVocabs({
    search: debouncedSearch,
    z_vocabDisplay_SETTINGS,
    paginateBy: 5,
    targetList_ID: typeof publicList_id === "string" ? publicList_id : "",
  });

  const collectedLangIds = useMemo(() => {
    // infinite loop   occurs if not defined
    return list?.collected_lang_ids?.split(",") || [];
  }, [list?.collected_lang_ids]);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  return (
    <Page_WRAP>
      <List_HEADER
        SHOW_listName={showTitle}
        list_NAME={list?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => TOGGLE_modal("displaySettings")}
        SAVE_list={() => TOGGLE_modal("saveList")}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <ExploreVocabs_FLATLIST
        {...{ vocabs }}
        onScroll={handleScroll}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          TOGGLE_modal("save");
        }}
        // IS_searching={ARE_vocabsFetching || IS_debouncing}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            IS_searching={ARE_vocabsFetching || IS_debouncing}
            totalVocabs={list?.vocabs?.[0]?.count}
            list_NAME={list?.name}
            vocabResults_COUNT={totalFilteredVocab_COUNT}
            {...{ search, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings }}
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
              HAS_reachedEnd: vocabs?.length >= totalFilteredVocab_COUNT,
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
      />

      {/* ------------------------------------------------------------------ MODALS ------------------------------------------------------------------ */}
      <SavePublicVocabToList_MODAL
        vocab={target_VOCAB}
        IS_open={modal_STATES.save}
        onSuccess={() => {
          TOGGLE_modal("save");
          toast.show(t("notifications.savedVocab"), {
            type: "green",
            duration: 3000,
          });
        }}
        TOGGLE_open={() => TOGGLE_modal("save")}
      />

      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLangIds}
        HAS_difficulties={false}
      />
      <CopyListAndVocabs_MODAL
        error={copyList_ERROR}
        IS_open={modal_STATES.saveList}
        IS_copying={IS_copyingList}
        copy={copy}
        RESET_error={RESET_copyListError}
        CLOSE_modal={() => TOGGLE_modal("saveList")}
      />
    </Page_WRAP>
  );
}
