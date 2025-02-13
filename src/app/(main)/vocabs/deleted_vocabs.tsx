//
//
//

import VocabList_NAV from "@/src/components/1_grouped/headers/listPage/VocabList_NAV";
import {
  ReviveDeletedVocab_MODAL,
  VocabDisplaySettings_MODAL,
} from "@/src/features/vocabs/components";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { USE_modalToggles } from "@/src/hooks/index";
import { Portal } from "@gorhom/portal";
import { FlashList } from "@shopify/flash-list";
import { USE_myVocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/USE_myVocabs";
import { Vocab_LIST } from "@/src/features/vocabs/vocabList/Vocabs_LIST/Vocabs_LIST";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { GET_vocabListComponents } from "@/src/features/vocabs/vocabList/GET_vocabListComponents/GET_vocabListComponents";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import { USE_targetVocabs } from "@/src/features/vocabs/vocabList/USE_targetVocabs/USE_targetVocabs";

const fetch_TYPE: vocabFetch_TYPES = "deleted";
const list_TYPE: vocabList_TYPES = "private";

export default function DeletedVocabs_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { list_id } = USE_listIdInParams();

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const list_REF = useRef<FlashList<any>>(null);

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { toRevive_VOCAB, SET_targetVocab, RESET_targetVocabs } =
    USE_targetVocabs();

  const { modals } = USE_modalToggles(["reviveVocab", "displaySettings"]);

  const {
    vocabs,
    vocabs_ERROR,
    HAS_reachedEnd,
    loading_STATE,
    unpaginated_COUNT,
    LOAD_moreVocabs,
    r_UPDATE_oneVocab,
    r_PREPEND_oneVocab,
    r_DELETE_oneVocab,
  } = USE_myVocabs({
    fetch_TYPE,
    list_TYPE,
    targetList_ID: list_id,
    search: debouncedSearch,
  });

  const { Flashlist_HEADER, Flashlist_FOOTER, Card } = GET_vocabListComponents({
    IS_debouncing,
    debouncedSearch,
    search,
    loading_STATE,
    list_NAME: "🗑️ Deleted vocabs",
    unpaginated_COUNT,
    vocabs_ERROR,
    HAS_reachedEnd,
    highlighted_ID: highlighted_ID || "",
    fetch_TYPE,
    list_TYPE,
    OPEN_modalCreateVocab: () => {},
    OPEN_modalUpdateVocab: () => {},
    LOAD_moreVocabs,
    RESET_search: () => SET_search(""),
  });

  return (
    <>
      <VocabList_NAV
        SHOW_listName={showTitle}
        list_NAME={"🗑️ Deleted vocabs"}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search }}
      />
      <Vocab_LIST
        vocabs={vocabs}
        Header={<Flashlist_HEADER />}
        Footer={<Flashlist_FOOTER />}
        Vocab_CARD={Card}
        flashlist_REF={list_REF}
        highlightedVocab_ID={highlighted_ID}
        onScroll={handleScroll}
        HIDE_vocabs={IS_debouncing || !!vocabs_ERROR}
      />

      <Portal>
        <ReviveDeletedVocab_MODAL
          vocab={toRevive_VOCAB}
          IS_open={modals.reviveVocab.IS_open}
          onSuccess={(new_VOCAB: Vocab_TYPE) => {
            modals.reviveVocab.set(false);
            RESET_targetVocabs();

            HIGHLIGHT_vocab(new_VOCAB.id);
            r_DELETE_oneVocab(new_VOCAB.id);
            toast.show(t("notifications.vocabRevived"), {
              type: "success",
              duration: 3000,
            });
          }}
          CLOSE_modal={() => {
            modals.reviveVocab.set(false);
            RESET_targetVocabs();
          }}
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
