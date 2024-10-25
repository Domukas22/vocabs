//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useLocalSearchParams } from "expo-router";
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
import PublicList_HEADER from "@/src/features/1_lists/components/PublicList_HEADER";
import ExporeSingleList_SUBNAV from "@/src/components/ExporeSingleList_SUBNAV";
import ExploreVocabs_FLATLIST from "@/src/features/2_vocabs/components/ExploreVocabs_FLATLIST";
import ExploreVocabsFlatlistBottom_SECTION from "@/src/features/2_vocabs/components/ExploreVocabsFlatlistBottom_SECTION";
import VocabsFlatlistHeader_SECTION from "@/src/features/2_vocabs/components/VocabsFlatlistHeader_SECTION";
import USE_copyListAndItsVocabs from "@/src/features/1_lists/hooks/USE_copyListAndItsVocabs";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import CopyListAndVocabs_MODAL from "@/src/features/1_lists/components/CopyListAndVocabs_MODAL";

export default function PublicListVocabs_PAGE() {
  const toast = useToast();
  const { user } = USE_auth();
  const { t } = useTranslation();
  const { publicList_id } = useLocalSearchParams();
  const { z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings } = USE_zustand();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "save" },
    { name: "displaySettings" },
    { name: "saveList" },
  ]);

  const { list, IS_listFetching, listFetch_ERROR } = USE_fetchOnePublicList(
    typeof publicList_id === "string" ? publicList_id : ""
  );

  const {
    COPY_listAndVocabs,
    IS_copyingList,
    copyList_ERROR,
    RESET_copyListError,
  } = USE_copyListAndItsVocabs();

  const copy = async () => {
    if (!list || IS_copyingList) return;
    const new_LIST = await COPY_listAndVocabs({
      list,
      user_id: user?.id,
      onSuccess: (new_LIST: List_MODEL) => {
        TOGGLE_modal("saveList");
        toast.show(t("notifications.listAndVocabsCopied"), {
          type: "green",
          duration: 5000,
        });
      },
    });

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
    HAS_reachedEnd,
  } = USE_supabaseVocabsOfAList({
    search: debouncedSearch,
    list,
    z_vocabDisplay_SETTINGS,
    paginateBy: 3,
  });

  const collectedLangIds = useMemo(() => {
    // infinite loop occurs if not defined
    return list?.collected_lang_ids || [];
  }, [list?.collected_lang_ids]);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  return (
    <Page_WRAP>
      <PublicList_HEADER
        list_NAME={list?.name}
        TOGGLE_saveListModal={() => TOGGLE_modal("saveList")}
        {...{ IS_listFetching }}
      />
      <ExporeSingleList_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        loading={IS_listFetching}
        {...{ search, SET_search }}
      />

      <ExploreVocabs_FLATLIST
        {...{
          vocabs,
          IS_loadingMore,
          HAS_reachedEnd,
          ARE_vocabsFetching,
          LOAD_more,
        }}
        SAVE_vocab={(vocab: Vocab_MODEL) => {
          SET_targetVocab(vocab);
          TOGGLE_modal("save");
        }}
        listHeader_EL={
          <VocabsFlatlistHeader_SECTION
            totalVocabs={list?.vocabs?.[0]?.count}
            {...{ search, z_vocabDisplay_SETTINGS, z_SET_vocabDisplaySettings }}
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
