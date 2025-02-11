//
//
//
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import React from "react";

import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import SwipeableExample from "@/src/components/3_other/SwipeableExample/SwipeableExample";

import { Deleted_VOCAB } from "../../vocabCards/Deleted_VOCAB/Deleted_VOCAB";
import { FlashList } from "@shopify/flash-list";
import { VocabsFlatlistHeader_SECTION } from "../VocabsFlatlistHeader_SECTION/VocabsFlatlistHeader_SECTION";
import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import { MyColors } from "@/src/constants/MyColors";
import { USE_vocabs_FETCH_TYPES } from "@/src/features/vocabs/functions/1_myVocabs/fetch/FETCH_myVocabs/types";
import { loadingState_TYPES } from "@/src/types";
import { Error_PROPS } from "@/src/props";
import { Vocab_MODEL } from "@/src/features/vocabs/types";
import { My_VOCAB } from "../../..";

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
  list_NAME = "",
  vocabs,
  vocabs_ERROR,
  HAS_reachedEnd,
  loading_STATE,
  unpaginated_COUNT,
  LOAD_more = () => {},
}: {
  PREPARE_vocabDelete: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  SELECT_forRevival?: (vocab: Vocab_MODEL) => void;
  HANDLE_updateModal?: (params: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
  highlightedVocab_ID: string | undefined;
  _ref?: React.RefObject<FlashList<any>>;
  search: string;
  debouncedSearch: string;
  IS_debouncing: boolean;
  RESET_search: () => void;
  OPEN_createVocabModal?: () => void;
  LOAD_more: () => void;
  fetch_TYPE: USE_vocabs_FETCH_TYPES;
  list_NAME: string | undefined;

  vocabs: Vocab_MODEL[] | undefined;
  vocabs_ERROR: Error_PROPS | undefined;
  HAS_reachedEnd: boolean;
  loading_STATE: loadingState_TYPES;
  unpaginated_COUNT: number;
}) {
  const Footer = () => {
    if (vocabs_ERROR) {
      return <Error_BLOCK paragraph={vocabs_ERROR?.user_MSG} />;
    }

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

  if (vocabs_ERROR?.value)
    return (
      <View style={{ padding: 12, backgroundColor: MyColors.fill_bg, flex: 1 }}>
        <Error_BLOCK
          paragraph={vocabs_ERROR?.msg}
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
          list_NAME={list_NAME}
          unpaginated_COUNT={unpaginated_COUNT}
        />
      }
      ListFooterComponent={<Footer />}
    />
  );
}
