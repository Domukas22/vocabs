//
//
//

import VocabList_NAV from "@/src/components/1_grouped/headers/listPage/VocabList_NAV";
import {
  ReviveDeletedVocab_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import { USE_debounceSearch, USE_showListHeaderTitle } from "@/src/hooks";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import Vocabs_FLASHLIST from "@/src/features/vocabs/Vocabs_FLASHLIST/Vocabs_FLASHLIST";
import { ListSettings_MODAL } from "@/src/features/lists/components";

const fetch_TYPE: vocabFetch_TYPES = "deleted";
const list_TYPE: vocabList_TYPES = "private";

export default function DeletedVocabs_PAGE() {
  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { modals } = USE_modalToggles([
    "reviveVocab",
    "displaySettings",
    "listSettings",
  ]);

  return (
    <>
      <VocabList_NAV
        SHOW_listName={showTitle}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        {...{ search, SET_search }}
      />
      <Vocabs_FLASHLIST
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
        <ReviveDeletedVocab_MODAL
          IS_open={modals.reviveVocab.IS_open}
          CLOSE_modal={() => modals.reviveVocab.set(false)}
        />
        <ListSettings_MODAL
          IS_open={modals.listSettings.IS_open}
          CLOSE_modal={() => modals.listSettings.set(false)}
        />
        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
        />
      </Portal>
    </>
  );
}
