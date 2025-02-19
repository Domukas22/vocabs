//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { VocabFlashlist_HEADER } from "../../components";
import { raw_Vocab_TYPE } from "../../types";
import { Vocab_CARD } from "../Vocabs_LIST/helpers";
import { VocabsSkeleton_BLOCK } from "../../../../features_new/vocabs/components/flashlists/components/VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";
import {
  myVocabFetch_TYPES,
  list_TYPES,
} from "../../../../features_new/vocabs/hooks/USE_fetchVocabs/FETCH_vocabs/types";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";

interface GET_vocabListComponents_PROPS {
  IS_debouncing: boolean;
  debouncedSearch: string;
  search: string;
  z_myVocabsLoading_STATE: loadingState_TYPES;
  list_NAME: string;
  unpaginated_COUNT: number;
  vocabs_ERROR: General_ERROR | undefined;
  HAS_reachedEnd: boolean;
  highlighted_ID: string;
  list_TYPE: list_TYPES;
  fetch_TYPE: myVocabFetch_TYPES;
  LOAD_moreVocabs: () => void;
  OPEN_modalCreateVocab: () => void;
  OPEN_vocabSoftDeleteModal: (vocab: raw_Vocab_TYPE) => void;
  OPEN_modalUpdateVocab: (vocab: raw_Vocab_TYPE) => void;
  RESET_search: () => void;
  UPDATE_vocabDifficulty: (
    vocab_ID: string,
    new_DIFFICULTY: 1 | 2 | 3
  ) => Promise<void>;
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[];
  UPDATE_vocabMarked: (vocab_ID: string, val: boolean) => Promise<void>;
}

export function GET_vocabListComponents({
  IS_debouncing,
  debouncedSearch,
  search,
  z_myVocabsLoading_STATE,
  list_NAME,
  unpaginated_COUNT,
  vocabs_ERROR,
  HAS_reachedEnd = false,
  highlighted_ID,
  list_TYPE,
  fetch_TYPE,
  LOAD_moreVocabs = () => {},
  OPEN_modalCreateVocab = () => {},
  OPEN_modalUpdateVocab = () => {},
  OPEN_vocabSoftDeleteModal = (vocab: raw_Vocab_TYPE) => {},
  UPDATE_vocabDifficulty = () => Promise.resolve(),
  z_myVocabsCurrent_ACTIONS = [],
  RESET_search = () => {},
  UPDATE_vocabMarked = () => Promise.resolve(),
}: GET_vocabListComponents_PROPS) {
  const Flashlist_HEADER = React.memo(() => (
    <VocabFlashlist_HEADER
      IS_debouncing={IS_debouncing}
      debouncedSearch={debouncedSearch}
      search={search}
      loading_STATE={z_myVocabsLoading_STATE}
      list_NAME={list_NAME}
      unpaginated_COUNT={unpaginated_COUNT}
      HAS_error={!!vocabs_ERROR}
    />
  ));

  const Flashlist_FOOTER = React.memo(() => {
    return vocabs_ERROR ? (
      <Error_BLOCK
        paragraph={vocabs_ERROR?.user_MSG || "Something went wrong"}
      />
    ) : IS_debouncing ||
      (z_myVocabsLoading_STATE !== "none" &&
        z_myVocabsLoading_STATE !== "loading_more") ? (
      <VocabsSkeleton_BLOCK />
    ) : (
      <BottomAction_BLOCK
        type="vocabs"
        createBtn_ACTION={OPEN_modalCreateVocab}
        LOAD_more={LOAD_moreVocabs}
        RESET_search={RESET_search}
        totalFilteredResults_COUNT={unpaginated_COUNT}
        debouncedSearch={debouncedSearch}
        z_myVocabsLoading_STATE={z_myVocabsLoading_STATE}
        HAS_reachedEnd={HAS_reachedEnd}
        IS_debouncing={IS_debouncing}
      />
    );
  });

  ///////////////////////////////////
  //

  const Card = React.memo(
    ({
      vocab,
      openVocab_IDs,
      TOGGLE_vocab,
    }: {
      vocab: raw_Vocab_TYPE;
      openVocab_IDs: Set<string>;
      TOGGLE_vocab: (vocab_ID: string, val?: boolean) => void;
    }) => (
      // <Vocab_CARD
      //   vocab={vocab}
      //   list_TYPE={list_TYPE}
      //   fetch_TYPE={fetch_TYPE}
      //   OPEN_vocabSoftDeleteModal={OPEN_vocabSoftDeleteModal}
      //   UPDATE_vocabDifficulty={UPDATE_vocabDifficulty}
      //   UPDATE_vocabMarked={UPDATE_vocabMarked}
      //   highlighted={highlighted_ID === vocab.id}
      //   IS_open={openVocab_IDs.has(vocab?.id)} // This will now reflect the updated Set reference
      //   TOGGLE_open={(val?: boolean) => TOGGLE_vocab(vocab.id, val)}
      //   current_ACTIONS={z_myVocabsCurrent_ACTIONS?.filter(
      //     (action) => action.vocab_ID === vocab?.id
      //   )}
      // />
      <Vocab_CARD
        vocab={vocab}
        list_TYPE={list_TYPE}
        fetch_TYPE={fetch_TYPE}
        OPEN_vocabSoftDeleteModal={() => {}}
        UPDATE_vocabDifficulty={async (
          vocab_ID: string,
          current_DIFFICULTY: number,
          new_DIFFICULTY: 1 | 2 | 3,
          CLOSE_editBtns: () => void
        ) => {
          await z_UPDATE_myVocabDifficulty(
            vocab_ID,
            current_DIFFICULTY,
            new_DIFFICULTY,
            {
              onSuccess: () => {
                TOAST("success", "Difficulty updated", "top"), CLOSE_editBtns();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
              },
              onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
            }
          );
        }}
        UPDATE_vocabMarked={(vocab_ID: string, val: boolean) =>
          z_MARK_myVocab(vocab_ID, val, {
            onSuccess: () => {
              TOAST("success", val ? "Vocab marked" : "Vocab unmarked", "top");

              if (val) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            },
            onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
          })
        }
        SOFTDELETE_vocab={(vocab_ID: string) =>
          z_SOFTDELETE_myVocab(vocab_ID, {
            onSuccess: () => TOAST("success", "Vocab deleted", "top"),
            onFailure: (err) => TOAST("error", err.user_MSG, "bottom", 10000),
          })
        }
        highlighted={highlighted_ID === item.id}
        IS_open={openVocab_IDs.has(item?.id)} // This will now reflect the updated Set reference
        TOGGLE_open={(val?: boolean) => TOGGLE_vocab(item.id, val)}
        current_ACTIONS={z_myVocabsCurrent_ACTIONS?.filter(
          (action) => action.vocab_ID === item?.id
        )}
      />
    )
  );

  return { Flashlist_HEADER, Flashlist_FOOTER, Card };
}
