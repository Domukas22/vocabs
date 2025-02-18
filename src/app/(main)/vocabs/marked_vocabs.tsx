//
//
//

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import {
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  DeleteVocab_MODAL,
} from "@/src/features/vocabs/components";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { USE_modalToggles } from "@/src/hooks/index";
import { FlashList } from "@shopify/flash-list";
import { Portal } from "@gorhom/portal";
import { USE_myVocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/USE_myVocabs";
import { Vocab_LIST } from "@/src/features/vocabs/vocabList/Vocabs_LIST/Vocabs_LIST";
import { USE_observeMyTargetList } from "@/src/features/lists/functions";
import { raw_Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { GET_vocabListComponents } from "@/src/features/vocabs/vocabList/GET_vocabListComponents/GET_vocabListComponents";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import {
  myVocabFetch_TYPES,
  list_TYPES,
} from "@/src/features_new/vocabs/functions/fetch/FETCH_vocabs/types";
import { USE_targetVocabs } from "@/src/features/vocabs/vocabList/USE_targetVocabs/USE_targetVocabs";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { ListSettings_MODAL } from "@/src/features/lists/components";

const fetch_TYPE: myVocabFetch_TYPES = "marked";
const list_TYPE: list_TYPES = "private";

export default function SavedVocabs_PAGE() {
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles([
    "updateVocab",
    "displaySettings",
    "listSettings",
  ]);

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        {...{ search, SET_search }}
      />
      <MyVocabs_FLASHLIST
        OPEN_updateVocabModal={() => modals.updateVocab.set(true)}
        RESET_search={() => SET_search("")}
        {...{
          IS_debouncing,
          search,
          debouncedSearch,
          list_TYPE,
          fetch_TYPE,
          handleScroll,
        }}
      />

      <Portal>
        <ListSettings_MODAL
          IS_open={modals.listSettings.IS_open}
          CLOSE_modal={() => modals.listSettings.set(false)}
        />
        <UpdateMyVocab_MODAL
          IS_open={modals.updateVocab.IS_open}
          CLOSE_modal={() => modals.updateVocab.set(false)}
        />
        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
      </Portal>
    </>
  );
}
