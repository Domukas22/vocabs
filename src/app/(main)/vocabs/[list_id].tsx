//
//
//

import React, { useCallback, useMemo } from "react";
import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import {
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";

import {
  USE_debounceSearch,
  USE_getMyListName,
  USE_showListHeaderTitle,
} from "@/src/hooks";
import { CreateMyVocab_MODAL } from "@/src/features/vocabs/components/1_myVocabs/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Portal } from "@gorhom/portal";
import { USE_modalToggles } from "@/src/hooks/index";
import { myVocabFetch_TYPES } from "@/src/features_new/vocabs/functions/fetch/FETCH_vocabs/types";
import MyVocabs_FLASHLIST from "@/src/features_new/vocabs/components/flashlists/MyVocabs_FLASHLIST/MyVocabs_FLASHLIST";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { t } from "i18next";
import { list_TYPES } from "@/src/features_new/lists/types";
import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/z_USE_myVocabs/z_USE_myVocabs";
import { UPDATE_listName } from "@/src/features_new/lists/hooks/USE_updateListName/UPDATE_listName/UPDATE_listName";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";

const fetch_TYPE: myVocabFetch_TYPES = "byTargetList";
const list_TYPE: list_TYPES = "private";

export default function SingleList_PAGE() {
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { list_NAME } = USE_getMyVocabFlashlistName();

  const { modals } = USE_modalToggles([
    "createVocab",
    "updateVocab",
    "listSettings",
    "displaySettings",
  ]);

  ///////////////////////////////////////////

  const { z_myList } = z_USE_myVocabs();

  const test = useCallback(() => {
    const fn = async () => {
      await UPDATE_listName(z_myList?.id, "--> Test here <--");
    };

    fn();
  }, [z_myList]);

  ///////////////////////////////////////////
  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME={list_NAME}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        OPEN_create={() => modals.createVocab.set(true)}
        {...{ search, SET_search }}
      />

      <Btn text="Test btn" onPress={test} />

      <MyVocabs_FLASHLIST
        OPEN_createVocabModal={() => modals.createVocab.set(true)}
        OPEN_updateVocabModal={() => modals.updateVocab.set(true)}
        RESET_search={() => SET_search("")}
        {...{
          IS_debouncing,
          search,
          debouncedSearch,
          list_TYPE,
          fetch_TYPE,
          handleScroll,
          list_NAME,
        }}
      />

      <Portal>
        <CreateMyVocab_MODAL
          IS_open={modals.createVocab.IS_open}
          CLOSE_modal={() => modals.createVocab.set(false)}
        />
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

function USE_getMyVocabFlashlistName() {
  const { z_myList, z_myVocabsLoading_STATE } = z_USE_myVocabs();

  const list_NAME = useMemo(() => {
    if (z_myVocabsLoading_STATE === "loading" && !z_myList?.name)
      return "Loading...";
    if (!z_myList?.name) return "NO LIST NAME PROVIDED";
    return z_myList.name;
  }, [z_myList, z_myVocabsLoading_STATE]);

  return { list_NAME };
}
