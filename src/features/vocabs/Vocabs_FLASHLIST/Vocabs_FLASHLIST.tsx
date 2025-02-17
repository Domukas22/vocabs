//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import List_MODEL from "@/src/db/models/List_MODEL";
import {
  USE_showListHeaderTitle,
  USE_highlighedId,
  USE_zustand,
  USE_getListName,
} from "@/src/hooks";
import { USE_toast } from "@/src/hooks/USE_toast/USE_toast";
import { z_USE_oneList } from "@/src/hooks/z_USE_oneList/z_USE_oneList";
import { USE_vocabZustandActions } from "@/src/hooks/USE_vocabZustandActions/USE_vocabZustandActions";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useRef } from "react";
import { VocabsFlatlistHeader_SECTION } from "../components";
import { USE_openVocabs } from "../vocabList/USE_openVocabs/USE_openVocabs";
import { Vocab_CARD } from "../vocabList/Vocabs_LIST/helpers";
import * as Haptics from "expo-haptics";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "../vocabList/USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { VocabFlatlistFooter_SECTION } from "./helpers";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { useTranslation } from "react-i18next";
import { USE_listIdInParams } from "../vocabList/USE_listIdInParams/USE_listIdInParams";
import { Vocab_TYPE } from "../types";

export default function Vocabs_FLASHLIST({
  IS_debouncing = false,
  search = "",
  debouncedSearch = "",
  list_TYPE,
  fetch_TYPE,
  OPEN_createVocabModal = () => {},
  OPEN_updateVocabModal = () => {},
  RESET_search = () => {},
  handleScroll = () => {},
}: {
  IS_debouncing: boolean;
  search: string;
  debouncedSearch: string;

  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  OPEN_createVocabModal?: () => void;
  OPEN_updateVocabModal?: (vocab: Vocab_TYPE) => void;
  RESET_search: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const { urlParamsList_ID } = USE_listIdInParams();
  const list_REF = useRef<FlashList<any>>(null);
  const { highlighted_ID, highlight: HIGHLIGHT_vocab } = USE_highlighedId();
  const { t } = useTranslation();

  const { TOAST } = USE_toast();
  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();

  const { z_user, z_vocabDisplay_SETTINGS } = USE_zustand();
  const { difficultyFilters, langFilters, sortDirection, sorting } =
    z_vocabDisplay_SETTINGS;

  const {
    list,
    vocabs,
    HAS_reachedEnd,
    unpaginated_COUNT,
    loading_STATE,
    currentVocab_ACTIONS,
    error,
    oL_FETCH,
    r_MARK_vocab,
    r_UPDATE_vocabDifficulty,
    r_SOFTDELETE_vocab,
    r_SET_targetVocab,
  } = z_USE_oneList();

  const { list_NAME } = USE_getListName();

  const { FETCH_vocabs } = USE_vocabZustandActions({
    user_id: z_user?.id || "",
    targetList_ID: urlParamsList_ID,
    list_TYPE,
    fetch_TYPE,

    search: debouncedSearch,
    difficultyFilters,
    langFilters,

    sortDirection,
    sorting,
    oL_FETCH,
  });

  // Refect on search / soritng / filter / list_id change
  useEffect(() => {
    (async () => await FETCH_vocabs())();
  }, [
    debouncedSearch,
    difficultyFilters,
    langFilters,
    sortDirection,
    sorting,
    urlParamsList_ID,
  ]);

  return (
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
          UPDATE_vocabDifficulty={async (
            vocab_ID: string,
            current_DIFFICULTY: number,
            new_DIFFICULTY: 1 | 2 | 3,
            CLOSE_editBtns: () => void
          ) => {
            await r_UPDATE_vocabDifficulty(
              vocab_ID,
              current_DIFFICULTY,
              new_DIFFICULTY,
              {
                onSuccess: () => {
                  TOAST("success", "Difficulty updated", "top"),
                    CLOSE_editBtns();
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
                },
                onFailure: (err) =>
                  TOAST("error", err.user_MSG, "bottom", 10000),
              }
            );
          }}
          UPDATE_vocabMarked={(vocab_ID: string, val: boolean) =>
            r_MARK_vocab(vocab_ID, val, {
              onSuccess: () => {
                TOAST(
                  "success",
                  val ? "Vocab marked" : "Vocab unmarked",
                  "top"
                );

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              },
              onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
            })
          }
          SOFTDELETE_vocab={(vocab_ID: string) =>
            r_SOFTDELETE_vocab(vocab_ID, {
              onSuccess: () => TOAST("success", "Vocab deleted", "top"),
              onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
            })
          }
          OPEN_updateVocabModal={(vocab: Vocab_TYPE) => {
            r_SET_targetVocab(vocab);
            OPEN_updateVocabModal(vocab);
          }}
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
          list_NAME={list_NAME}
          unpaginated_COUNT={unpaginated_COUNT}
          HAS_error={!!error}
        />
      }
      ListFooterComponent={
        <VocabFlatlistFooter_SECTION
          LOAD_more={() => FETCH_vocabs(true)}
          OPEN_createVocabModal={OPEN_createVocabModal}
          RESET_search={RESET_search}
          {...{
            HAS_reachedEnd,
            IS_debouncing,
            loading_STATE,
            debouncedSearch,
            unpaginated_COUNT,
            error,
          }}
        />
      }
    />
  );
}
