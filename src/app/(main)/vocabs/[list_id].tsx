//
//
//

import { useLocalSearchParams, useRouter } from "expo-router";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";

import VocabList_NAV from "@/src/components/1_grouped/headers/listPage/VocabList_NAV";
import { FlashList } from "@shopify/flash-list";
import { ListSettings_MODAL } from "@/src/features/lists/components";
import {
  UpdateMyVocab_MODAL,
  VocabDisplaySettings_MODAL,
  DeleteVocab_MODAL,
  VocabsFlatlistHeader_SECTION,
} from "@/src/features/vocabs/components";
import {
  USE_debounceSearch,
  USE_showListHeaderTitle,
  USE_highlighedId,
  USE_zustand,
  USE_abortController,
} from "@/src/hooks";
import { CreateMyVocab_MODAL } from "@/src/features/vocabs/components/1_myVocabs/modals/CreateMyVocab_MODAL/CreateMyVocab_MODAL";
import { Portal } from "@gorhom/portal";
import { USE_modalToggles } from "@/src/hooks/index";
import { USE_observeMyTargetList } from "@/src/features/lists/functions";
import { USE_myVocabs } from "@/src/features/vocabs/vocabList/USE_myVocabs/USE_myVocabs";
import { Vocab_LIST } from "@/src/features/vocabs/vocabList/Vocabs_LIST/Vocabs_LIST";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import { GET_vocabListComponents } from "@/src/features/vocabs/vocabList/GET_vocabListComponents/GET_vocabListComponents";
import { USE_targetVocabs } from "@/src/features/vocabs/vocabList/USE_targetVocabs/USE_targetVocabs";
import { USE_listIdInParams } from "@/src/features/vocabs/vocabList/USE_listIdInParams/USE_listIdInParams";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import {
  FETCH_myVocabs_ARG_TYPES,
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { Delay } from "@/src/utils";
import { USE_openVocabs } from "@/src/features/vocabs/vocabList/USE_openVocabs/USE_openVocabs";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { Vocab_CARD } from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers";
import { VocabsSkeleton_BLOCK } from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers/VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";
import Vocab_FRONT from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers/VocabCards/helpers/Vocab_FRONT/Vocab_FRONT";
import { VocabBack_TRS } from "@/src/features/vocabs/components/1_myVocabs/vocabCards/Components/VocabBack_TRS/VocabBack_TRS";
import VocabBack_TEXT from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers/VocabCards/helpers/VocabBack_TEXT/VocabBack_TEXT";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { USE_markVocab } from "@/src/features/vocabs/vocabList/USE_markVocab/USE_markVocab";
import VocabBack_BTNS from "@/src/features/vocabs/vocabList/Vocabs_LIST/helpers/VocabCards/helpers/VocabBack_BTNS/VocabBack_BTNS";
import { USE_updateVocabDifficulty } from "@/src/features/vocabs/vocabList/USE_updateVocabDifficulty/USE_updateVocabDifficulty";
import { UPDATE_oneVocab_PAYLOAD } from "@/src/features/vocabs/vocabList/USE_myVocabs/helpers/USE_myVocabsReducer/Vocab_REDUCER/types";
import { USE_softDeleteVocab } from "@/src/features/vocabs/vocabList/USE_softDeleteVocab/USE_softDeleteVocab";
import { USE_vocabZustand } from "@/src/hooks/USE_vocabZustand/USE_vocabZustand";
import { VOCAB_PAGINATION } from "@/src/constants/globalVars";

const fetch_TYPE: vocabFetch_TYPES = "byTargetList";
const list_TYPE: vocabList_TYPES = "private";

export default function SingleList_PAGE() {
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { list_id } = USE_listIdInParams();
  const selected_LIST = USE_observeMyTargetList(list_id);

  useEffect(() => {
    console.log("Gello");
  }, []);

  const { showTitle, handleScroll } = USE_showListHeaderTitle();
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const list_REF = useRef<FlashList<any>>(null);

  const { search, debouncedSearch, IS_debouncing, SET_search } =
    USE_debounceSearch();

  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  // const { currentVocab_ACTIONS, START_vocabAction, STOP_vocabAction } =
  //   USE_currentVocabActions();
  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();

  const {
    vocabs,
    printed_IDS,
    HAS_reachedEnd,
    unpaginated_COUNT,
    loading_STATE,
    currentVocab_ACTIONS,
    error,
    r_FETCH_vocabs,
    r_MARK_vocab,
    r_UPDATE_vocabDifficulty,
    r_SOFTDELETE_vocab,
  } = USE_vocabZustand();

  const { START_newRequest } = USE_abortController();
  // const { FETCH_vocabs, x } = USE_vocabZustandActions({
  //   search: debouncedSearch,
  //   difficultyFilters,
  //   langFilters,
  //   sortDirection,
  //   sorting,
  //   user_id: z_user?.id || "",
  //   targetList_ID: list_id,
  //   amount: VOCAB_PAGINATION || 50,
  //   printed_IDS,
  //   fetch_TYPE,
  //   list_TYPE,
  //   r_FETCH_vocabs,
  // });

  const FETCH_vocabs = useCallback(
    async (loadMore: boolean = false) => {
      const newController = START_newRequest();
      await r_FETCH_vocabs(
        {
          search: debouncedSearch,
          difficultyFilters,
          langFilters,
          sortDirection,
          sorting,
          user_id: z_user?.id || "",
          targetList_ID: list_id,
          // amount: VOCAB_PAGINATION || 50,
          amount: 2,
          excludeIds: loadMore ? printed_IDS : new Set(),
          fetch_TYPE,
          list_TYPE,
          signal: newController.signal,
        },
        loadMore,
        loadMore ? "loading_more" : undefined
      );
    },
    [
      debouncedSearch,
      // debouncedSearch,
      difficultyFilters,
      langFilters,
      sortDirection,
      sorting,
      z_user?.id,
      list_id,
      printed_IDS,
    ]
  );
  const MARK_vocab = useCallback(async (vocab_ID: string, val: boolean) => {
    await r_MARK_vocab(vocab_ID, val);
  }, []);

  useEffect(() => {
    (async () => await FETCH_vocabs())();
  }, [search, difficultyFilters, langFilters, sortDirection, sorting, list_id]);

  const {
    toUpdate_VOCAB,
    toDelete_VOCAB,
    toMove_VOCAB,
    SET_targetVocab,
    RESET_targetVocabs,
  } = USE_targetVocabs();

  const { modals } = USE_modalToggles([
    "createVocab",
    "deleteVocab",
    "updateVocab",
    "listSettings",
    "displaySettings",
  ]);

  // const {
  //   vocabs,
  //   vocabs_ERROR,
  //   HAS_reachedEnd,
  //   loading_STATE,
  //   unpaginated_COUNT,
  //   LOAD_moreVocabs,
  //   r_UPDATE_oneVocab,
  //   r_PREPEND_oneVocab,
  //   r_DELETE_oneVocab,
  // } = USE_myVocabs({
  //   fetch_TYPE,
  //   list_TYPE,
  //   targetList_ID: list_id,
  //   search: debouncedSearch,
  // });

  // 🟡 ----------------------------------------------------------------------

  // const { MARK_vocab } = USE_markVocab({
  //   currentVocab_ACTIONS,
  //   START_vocabAction,
  //   STOP_vocabAction,
  //   onSuccess: (vocab: Vocab_TYPE) => r_UPDATE_oneVocab(vocab),
  // });
  // const { UPDATE_difficulty } = USE_updateVocabDifficulty({
  //   currentVocab_ACTIONS,
  //   START_vocabAction,
  //   STOP_vocabAction,
  //   onSuccess: (vocab: Vocab_TYPE) => r_UPDATE_oneVocab(vocab),
  // });
  // const { SOFTDELETE_vocab } = USE_softDeleteVocab({
  //   currentVocab_ACTIONS,
  //   START_vocabAction,
  //   STOP_vocabAction,
  //   onSuccess: (vocab_ID: string) => r_DELETE_oneVocab(vocab_ID),
  // });
  // 🟡 ----------------------------------------------------------------------

  return (
    <>
      <VocabList_NAV
        SHOW_listName={showTitle}
        list_NAME={selected_LIST?.name}
        GO_back={() => router.back()}
        OPEN_displaySettings={() => modals.displaySettings.set(true)}
        OPEN_listSettings={() => modals.listSettings.set(true)}
        OPEN_create={() => modals.createVocab.set(true)}
        {...{ search, SET_search }}
      />
      <Btn text="Test " onPress={() => FETCH_vocabs()} />

      <Styled_FLASHLIST
        onScroll={handleScroll}
        data={
          IS_debouncing ||
          !!error ||
          (loading_STATE !== "none" &&
            loading_STATE !== "error" &&
            loading_STATE !== "loading_more")
            ? []
            : vocabs || []
        }
        flashlist_REF={list_REF}
        renderItem={({ item }) => (
          <Vocab_CARD
            vocab={item}
            list_TYPE={list_TYPE}
            fetch_TYPE={fetch_TYPE}
            OPEN_vocabSoftDeleteModal={(vocab: Vocab_TYPE) => {
              SET_targetVocab(vocab, "update");
              modals.deleteVocab.set(true);
            }}
            UPDATE_vocabDifficulty={async (
              vocab_ID: string,
              current_DIFFICULTY: number,
              new_DIFFICULTY: 1 | 2 | 3,
              CLOSE_editBtns: () => void
            ) => {
              await r_UPDATE_vocabDifficulty(
                vocab_ID,
                current_DIFFICULTY,
                new_DIFFICULTY
              );
            }}
            UPDATE_vocabMarked={MARK_vocab}
            SOFTDELETE_vocab={r_SOFTDELETE_vocab}
            highlighted={highlighted_ID === item.id}
            IS_open={openVocab_IDs.has(item?.id)} // This will now reflect the updated Set reference
            TOGGLE_open={(val?: boolean) => TOGGLE_vocab(item.id, val)}
            current_ACTIONS={currentVocab_ACTIONS?.filter(
              (action) => action.vocab_ID === item?.id
            )}
          />
        )}
        keyExtractor={(item) => "Vocab" + item.id}
        extraData={[
          highlighted_ID,
          openVocab_IDs,
          currentVocab_ACTIONS,
          // UPDATE_difficulty,
        ]}
        ListHeaderComponent={
          <VocabsFlatlistHeader_SECTION
            IS_debouncing={IS_debouncing}
            debouncedSearch={debouncedSearch}
            search={search}
            loading_STATE={loading_STATE}
            list_NAME={selected_LIST?.name || ""}
            unpaginated_COUNT={unpaginated_COUNT}
            HAS_error={!!error}
          />
        }
        ListFooterComponent={
          error ? (
            <Error_BLOCK
              paragraph={error?.user_MSG || "Something went wrong"}
            />
          ) : IS_debouncing ||
            (loading_STATE !== "none" && loading_STATE !== "loading_more") ? (
            <VocabsSkeleton_BLOCK />
          ) : (
            <BottomAction_BLOCK
              type="vocabs"
              createBtn_ACTION={() => modals.createVocab.set(true)}
              LOAD_more={() => FETCH_vocabs(true)}
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
        <CreateMyVocab_MODAL
          IS_open={modals.createVocab.IS_open}
          initial_LIST={selected_LIST}
          TOGGLE_modal={() => modals.createVocab.set(false)}
          onSuccess={(new_VOCAB: Vocab_TYPE) => {
            modals.createVocab.set(false);
            RESET_targetVocabs();

            HIGHLIGHT_vocab(new_VOCAB.id);
            // r_PREPEND_oneVocab(new_VOCAB);
            list_REF?.current?.scrollToOffset({ animated: true, offset: 0 });
            toast.show(t("notifications.vocabCreated"), {
              type: "success",
              duration: 3000,
            });
          }}
        />
        <ListSettings_MODAL
          selected_LIST={selected_LIST}
          open={modals.listSettings.IS_open}
          TOGGLE_open={() => modals.listSettings.set(false)}
          backToIndex={() => router.back()}
        />
        <UpdateMyVocab_MODAL
          toUpdate_VOCAB={toUpdate_VOCAB}
          IS_open={modals.updateVocab.IS_open}
          CLOSE_modal={() => {
            modals.updateVocab.set(false);
            RESET_targetVocabs();
          }}
          onSuccess={(updated_VOCAB: Vocab_TYPE) => {
            modals.updateVocab.set(false);
            RESET_targetVocabs();
            HIGHLIGHT_vocab(updated_VOCAB.id);
            toast.show(t("notifications.vocabUpdated"), {
              type: "success",
              duration: 3000,
            });
          }}
        />
        <VocabDisplaySettings_MODAL
          open={modals.displaySettings.IS_open}
          TOGGLE_open={() => modals.displaySettings.set(false)}
          collectedLang_IDS={
            selected_LIST?.collected_lang_ids?.split(",") || []
          }
        />
      </Portal>
    </>
  );
}

////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
export interface currentVocabAction_TYPE {
  vocab_ID: string;
  action:
    | "deleting"
    | "updating"
    | "updating_difficulty"
    | "updating_marked"
    | "moving"
    | "copying";
  new_DIFFICULTY?: number;
}

function USE_currentVocabActions() {
  const [currentVocab_ACTIONS, SET_currentVocabActions] = useState<
    currentVocabAction_TYPE[]
  >([]);

  const STOP_vocabAction = useCallback((vocab_ID: string) => {
    SET_currentVocabActions((prev) =>
      prev.filter((action) => action.vocab_ID !== vocab_ID)
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

///
//
//

function USE_vocabZustandActions({
  search,
  difficultyFilters,
  langFilters,
  sortDirection,
  sorting,
  user_id,
  targetList_ID,
  printed_IDS,
  r_FETCH_vocabs = () => Promise.resolve(),
}: {
  search: string;
  amount: number;
  user_id: string;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  targetList_ID?: string;
  difficultyFilters: (1 | 2 | 3)[];
  printed_IDS: Set<string>;
  langFilters: string[];
  sortDirection: "ascending" | "descending";
  sorting: "difficulty" | "date" | "shuffle";
  r_FETCH_vocabs: (args: FETCH_myVocabs_ARG_TYPES) => Promise<void>;
}) {
  const x = useCallback(() => console.log("eetyooo"), []);
  const FETCH_vocabs = useCallback(async () => {
    const { START_newRequest } = USE_abortController();
    const newController = START_newRequest();
    console.log("ss");
    await r_FETCH_vocabs({
      search,
      difficultyFilters,
      langFilters,
      sortDirection,
      sorting,
      user_id,
      targetList_ID,
      amount: VOCAB_PAGINATION || 50,
      excludeIds: new Set(),
      fetch_TYPE,
      list_TYPE,
      signal: newController.signal,
    });
  }, [
    search,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    user_id,
    targetList_ID,
    printed_IDS,
  ]);

  const LOAD_moreVocabs = useCallback(() => {}, []);

  return { FETCH_vocabs, x };
}
