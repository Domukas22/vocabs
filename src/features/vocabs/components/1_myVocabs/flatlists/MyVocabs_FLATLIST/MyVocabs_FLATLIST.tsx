//
//
//
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import React, { useMemo } from "react";

import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import SwipeableExample from "@/src/components/3_other/SwipeableExample/SwipeableExample";
import { My_VOCAB } from "../../vocabCards/My_VOCAB/My_VOCAB";
import { Deleted_VOCAB } from "../../vocabCards/Deleted_VOCAB/Deleted_VOCAB";
import { FlashList } from "@shopify/flash-list";
import { VocabsFlatlistHeader_SECTION } from "../VocabsFlatlistHeader_SECTION/VocabsFlatlistHeader_SECTION";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import {
  loadingState_TYPES,
  USE_myVocabs,
  USE_vocabs_FETCH_TYPES,
} from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";
import List_MODEL from "@/src/db/models/List_MODEL";
import { MyColors } from "@/src/constants/MyColors";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { FETCH_myVocabs_ERROR_PROPS } from "@/src/features/vocabs/functions/1_myVocabs/fetch/FETCH_myVocabs/types";

export function MyVocabs_FLATLIST({
  PREPARE_vocabDelete,
  onScroll,
  highlightedVocab_ID,
  HANDLE_updateModal,
  SELECT_forRevival = () => {},
  _ref,

  search = "",
  debouncedSearch = "",
  IS_debouncing = false,
  RESET_search = () => {},
  OPEN_createVocabModal = () => {},
  fetch_TYPE = "allVocabs",
  list,
  vocabs,
  fetchVocabs_ERROR,
  HAS_reachedEnd,
  loading_STATE,
  unpaginated_COUNT,
  LOAD_more = () => {},
}: {
  PREPARE_vocabDelete: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  SELECT_forRevival?: (vocab: Vocab_MODEL) => void;
  HANDLE_updateModal: (vocab: Vocab_MODEL) => void;
  highlightedVocab_ID: string | undefined;
  _ref?: React.RefObject<FlashList<any>>;
  search: string;
  debouncedSearch: string;
  IS_debouncing: boolean;
  RESET_search: () => void;
  OPEN_createVocabModal: () => void;
  LOAD_more: () => void;
  fetch_TYPE: USE_vocabs_FETCH_TYPES;
  list: List_MODEL | undefined;

  vocabs: Vocab_MODEL[];
  fetchVocabs_ERROR: any;
  HAS_reachedEnd: boolean;
  loading_STATE: loadingState_TYPES;
  unpaginated_COUNT: number;
}) {
  const Footer = () => {
    if (
      IS_debouncing ||
      (loading_STATE !== "none" && loading_STATE !== "loading_more")
    ) {
      return (
        <View style={{ gap: 12, flex: 1 }}>
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
        </View>
      );
    } else
      return (
        <BottomAction_BLOCK
          type="vocabs"
          createBtn_ACTION={OPEN_createVocabModal}
          {...{
            debouncedSearch,

            loading_STATE,
            HAS_reachedEnd,
            LOAD_more,
            RESET_search,
          }}
          totalFilteredResults_COUNT={unpaginated_COUNT}
        />
      );
  };

  const Vocab_BTN = (vocab: Vocab_MODEL) =>
    fetch_TYPE !== "deletedVocabs" ? (
      <SwipeableExample
        rightBtn_ACTION={() => {
          if (PREPARE_vocabDelete) PREPARE_vocabDelete(vocab);
        }}
      >
        <My_VOCAB
          vocab={vocab}
          highlighted={highlightedVocab_ID === vocab.id}
          {...{ HANDLE_updateModal }}
        />
      </SwipeableExample>
    ) : (
      <Deleted_VOCAB vocab={vocab} {...{ SELECT_forRevival }} />
    );

  if (fetchVocabs_ERROR?.value)
    return (
      <View style={{ padding: 12, backgroundColor: MyColors.fill_bg, flex: 1 }}>
        <Error_BLOCK
          paragraph={fetchVocabs_ERROR?.msg}
          title="Something went wrong..."
        />
      </View>
    );

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={IS_debouncing ? [] : vocabs || []}
      _ref={_ref}
      renderItem={({ item }) => Vocab_BTN(item)}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={highlightedVocab_ID}
      ListHeaderComponent={
        <VocabsFlatlistHeader_SECTION
          IS_debouncing={IS_debouncing}
          debouncedSearch={debouncedSearch}
          search={search}
          loading_STATE={loading_STATE}
          list_NAME={list?.name}
          unpaginated_COUNT={unpaginated_COUNT}
        />
      }
      ListFooterComponent={<Footer />}
    />
  );
}
