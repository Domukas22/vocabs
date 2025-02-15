//
//
//

import VocabList_NAV from "@/src/components/1_grouped/headers/listPage/VocabList_NAV";
import {
  ReviveDeletedVocab_MODAL,
  VocabDisplaySettings_MODAL,
  VocabsFlatlistHeader_SECTION,
} from "@/src/features/vocabs/components";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
} from "@/src/hooks";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
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
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { Vocab_CARD } from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers";
import { VocabsSkeleton_BLOCK } from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers/VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";
import { USE_openVocabs } from "@/src/features/vocabs/vocabList/USE_openVocabs/USE_openVocabs";
import { currentVocabAction_TYPE } from "./[list_id]";

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

  // const { Flashlist_HEADER, Flashlist_FOOTER, Card } = GET_vocabListComponents({
  //   IS_debouncing,
  //   debouncedSearch,
  //   search,
  //   loading_STATE,
  //   list_NAME: "🗑️ Deleted vocabs",
  //   unpaginated_COUNT,
  //   vocabs_ERROR,
  //   HAS_reachedEnd,
  //   highlighted_ID: highlighted_ID || "",
  //   fetch_TYPE,
  //   list_TYPE,
  //   OPEN_modalCreateVocab: () => {},
  //   OPEN_modalUpdateVocab: () => {},
  //   LOAD_moreVocabs,
  //   RESET_search: () => SET_search(""),
  // });

  const { currentVocab_ACTIONS, START_vocabAction, STOP_vocabAction } =
    USE_currentVocabActions();
  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();

  return (
    <>
      <VocabList_NAV
        SHOW_listName={showTitle}
        list_NAME={"🗑️ Deleted vocabs"}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        {...{ search, SET_search }}
      />
      <Styled_FLASHLIST
        onScroll={handleScroll}
        data={IS_debouncing || !!vocabs_ERROR ? [] : vocabs || []}
        flashlist_REF={list_REF}
        renderItem={({ item }) => (
          <Vocab_CARD
            vocab={item}
            list_TYPE={list_TYPE}
            fetch_TYPE={fetch_TYPE}
            highlighted={highlighted_ID === item.id}
            IS_open={openVocab_IDs.has(item?.id)} // This will now reflect the updated Set reference
            TOGGLE_open={(val?: boolean) => TOGGLE_vocab(item.id, val)}
            current_ACTIONS={currentVocab_ACTIONS?.filter(
              (action) => action.id === item?.id
            )}
          />
        )}
        keyExtractor={(item) => "Vocab" + item.id}
        extraData={[highlighted_ID, openVocab_IDs, currentVocab_ACTIONS]}
        ListHeaderComponent={
          <VocabsFlatlistHeader_SECTION
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={"🗑️ Deleted vocabs"}
            unpaginated_COUNT={unpaginated_COUNT}
            HAS_error={!!vocabs_ERROR}
          />
        }
        ListFooterComponent={
          vocabs_ERROR ? (
            <Error_BLOCK
              paragraph={vocabs_ERROR?.user_MSG || "Something went wrong"}
            />
          ) : IS_debouncing ||
            (loading_STATE !== "none" && loading_STATE !== "loading_more") ? (
            <VocabsSkeleton_BLOCK />
          ) : (
            <BottomAction_BLOCK
              type="vocabs"
              createBtn_ACTION={() => {}}
              LOAD_more={LOAD_moreVocabs}
              RESET_search={() => SET_search("")}
              totalFilteredResults_COUNT={unpaginated_COUNT}
              debouncedSearch={debouncedSearch}
              loading_STATE={loading_STATE}
              HAS_reachedEnd={HAS_reachedEnd}
              IS_debouncing={IS_debouncing}
            />
          )
        }
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

function USE_currentVocabActions() {
  const [currentVocab_ACTIONS, SET_currentVocabActions] = useState<
    currentVocabAction_TYPE[]
  >([]);

  const STOP_vocabAction = useCallback((vocab_ID: string) => {
    SET_currentVocabActions((prev) =>
      prev.filter((action) => action.id !== vocab_ID)
    );
  }, []);

  const START_vocabAction = useCallback(
    (new_ACTION: currentVocabAction_TYPE) => {
      SET_currentVocabActions((prev) => [...prev, new_ACTION]);
    },
    []
  );

  return { currentVocab_ACTIONS, START_vocabAction, STOP_vocabAction };
}
