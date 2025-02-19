//
//
//

import { useRouter, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import List_MODEL from "@/src/db/models/List_MODEL";

import { useTranslation } from "react-i18next";
import React from "react";
import { useToast } from "react-native-toast-notifications";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import { CopyListAndVocabs_MODAL } from "@/src/features/lists/components";
import {
  USE_fetchOneSharedList,
  USE_copyListAndItsVocabs,
} from "@/src/features/lists/functions";
import {
  ExploreVocabs_FLATLIST,
  VocabFlashlist_HEADER,
  SavePublicVocabToList_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_getActiveFilterCount } from "@/src/hooks";
import { USE_supabaseVocabs } from "@/src/features/vocabs/functions";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_zustand } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";

export default function PublicListVocabs_PAGE() {
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();
  const { t } = useTranslation();
  const { z_user } = USE_zustand();
  const { sharedList_id } = useLocalSearchParams();
  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();
  const toast = useToast();
  const router = useRouter();
  const { activeFilter_COUNT } = USE_getActiveFilterCount("vocabs");

  const { sharedList, IS_sharedListFetching, sharedList_ERROR } =
    USE_fetchOneSharedList(
      typeof sharedList_id === "string" ? sharedList_id : ""
    );

  const { modals } = USE_modalToggles(["saveList", "displaySettings"]);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();

  const {
    COPY_listAndVocabs,
    IS_copyingList,
    copyList_ERROR,
    RESET_copyListError,
  } = USE_copyListAndItsVocabs();

  const copy = async () => {
    if (!sharedList || IS_copyingList) return;

    const new_LIST = await COPY_listAndVocabs({
      list: sharedList,
      user: z_user,
      onSuccess: (new_LIST: List_MODEL) => {
        modals.saveList.set(false);

        toast.show(t("notifications.listAndVocabsCopied"), {
          type: "success",
          duration: 5000,
        });
      },
    });

    if (!new_LIST.success) {
      console.error(new_LIST.msg); // Log internal message for debugging.
    }
  };

  const collectedLangIds = useMemo(() => {
    // infinite loop occurs if not defined
    return sharedList?.collected_lang_ids || [];
  }, [sharedList?.collected_lang_ids]);

  const {
    IS_searching,
    data: vocabs,
    error: vocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
  } = USE_supabaseVocabs({
    type: "byTargetList",
    targetList_ID: typeof sharedList_id === "string" ? sharedList_id : "",
    search: debouncedSearch,
    IS_debouncing,
    z_vocabDisplay_SETTINGS,
  });

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME={sharedList?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        SAVE_list={() => modals.saveList.set(true)}
        {...{ search, SET_search, activeFilter_COUNT }}
      />

      <ExploreVocabs_FLATLIST
        {...{ vocabs, IS_searching }}
        error={vocabs_ERROR}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          modals.saveList.set(true);
        }}
        onScroll={handleScroll}
        listHeader_EL={
          <VocabFlashlist_HEADER
            search={search}
            totalVocabs={totalFilteredVocab_COUNT}
            IS_searching={IS_searching}
            list_NAME={sharedList?.name}
            unpaginated_COUNT={totalFilteredVocab_COUNT}
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

      {/* -------------------------------------------- MODALS -------------------------------------------- */}

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
