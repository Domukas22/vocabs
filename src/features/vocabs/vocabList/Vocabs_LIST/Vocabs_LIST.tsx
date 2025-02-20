//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { raw_Vocab_TYPE } from "../../types";
import React from "react";
import { USE_openVocabs } from "../USE_openVocabs/USE_openVocabs";
import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import {
  list_TYPES,
  vocabFetch_TYPES,
} from "../../../../features_new/vocabs/hooks/fetchVocabs/FETCH_vocabs/types";
import { VocabFlashlist_HEADER } from "../../components";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { VocabsSkeleton_BLOCK } from "../../../../features_new/vocabs/components/flashlists/components/VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";
import { Vocab_CARD } from "./helpers";

export function Vocab_LIST({
  vocabs,

  flashlist_REF,
  highlightedVocab_ID,

  onScroll,
  HIDE_vocabs = false,
  current_ACTIONS = [],

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
}: {
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  highlightedVocab_ID: string | undefined;
  flashlist_REF?: React.RefObject<FlashList<any>>;
  HIDE_vocabs: boolean;
  vocabs: raw_Vocab_TYPE[] | undefined;
  current_ACTIONS: currentVocabAction_TYPE[];

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
  fetch_TYPE: vocabFetch_TYPES;
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
}) {
  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={HIDE_vocabs ? [] : vocabs || []}
      flashlist_REF={flashlist_REF}
      renderItem={({ item }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE={list_TYPE}
          fetch_TYPE={fetch_TYPE}
          OPEN_vocabSoftDeleteModal={OPEN_vocabSoftDeleteModal}
          UPDATE_vocabDifficulty={UPDATE_vocabDifficulty}
          UPDATE_vocabMarked={UPDATE_vocabMarked}
          highlighted={highlighted_ID === item.id}
          IS_open={openVocab_IDs.has(item?.id)} // This will now reflect the updated Set reference
          TOGGLE_open={(val?: boolean) => TOGGLE_vocab(item.id, val)}
          current_ACTIONS={z_myVocabsCurrent_ACTIONS?.filter(
            (action) => action.vocab_ID === item?.id
          )}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[highlightedVocab_ID, openVocab_IDs, current_ACTIONS]}
      ListHeaderComponent={
        <VocabFlashlist_HEADER
          IS_debouncing={IS_debouncing}
          debouncedSearch={debouncedSearch}
          search={search}
          loading_STATE={z_myVocabsLoading_STATE}
          list_NAME={list_NAME}
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
        )
      }
    />
  );
}
