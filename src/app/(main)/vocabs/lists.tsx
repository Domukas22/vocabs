//
//
//

import React from "react";
import List_MODEL from "@/src/db/models/List_MODEL";
import { Portal } from "@gorhom/portal";

import FlashlistPage_NAV from "@/src/components/1_grouped/headers/listPage/FlashlistPage_NAV";

import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_modalToggles,
} from "@/src/hooks";

import {
  CreateList_MODAL,
  ListDisplaySettings_MODAL,
} from "@/src/features/lists/components";
import MyLists_FLASHLIST from "@/src/features/lists/Lists_FLASHLIST/MyLists_FLASHLIST/MyLists_FLASHLIST";

export default function MyLists_PAGE() {
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles(["createList", "displaySettings"]);

  return (
    <>
      <FlashlistPage_NAV
        SHOW_listName={showTitle}
        list_NAME="My Lists"
        OPEN_displaySettings={() => modals.displaySettings.toggle()}
        OPEN_create={() => modals.createList.toggle()}
        {...{ search, SET_search }}
      />

      <MyLists_FLASHLIST
        OPEN_createListModal={() => modals.createList.set(true)}
        RESET_search={() => SET_search("")}
        list_TYPE="private"
        {...{
          IS_debouncing,
          search,
          debouncedSearch,
          handleScroll,
        }}
      />

      <Portal>
        <CreateList_MODAL
          IS_open={modals.createList.IS_open}
          currentList_NAMES={[]}
          CLOSE_modal={() => modals.createList.toggle()}
          onSuccess={(newList: List_MODEL) => {
            // highlight(newList?.id);
            // list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
            // PREPEND_oneVocabToReducer(newList);
            // toast.show(t("notifications.listCreated"), {
            //   type: "success",
            //   duration: 5000,
            // });
          }}
        />

        <ListDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.toggle()}
        />
      </Portal>
    </>
  );
}

///-----------------------------------------
