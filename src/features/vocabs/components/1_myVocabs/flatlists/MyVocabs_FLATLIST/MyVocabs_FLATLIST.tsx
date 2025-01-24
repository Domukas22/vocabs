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
import { USE_vocabs } from "@/src/features/vocabs/functions";
import { USE_vocabs_FETCH_TYPES } from "@/src/features/vocabs/functions/1_myVocabs/fetch/hooks/USE_myVocabs/USE_myVocabs";
import List_MODEL from "@/src/db/models/List_MODEL";
import { MyColors } from "@/src/constants/MyColors";

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
}: {
  PREPARE_vocabDelete: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  SELECT_forRevival?: (vocab: Vocab_MODEL) => void;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
  highlightedVocab_ID: string | undefined;
  _ref?: React.RefObject<FlashList<any>>;

  search: string;
  debouncedSearch: string;
  IS_debouncing: boolean;
  RESET_search: () => void;
  OPEN_createVocabModal: () => void;
  fetch_TYPE: USE_vocabs_FETCH_TYPES;
  list: List_MODEL | undefined;
}) {
  const {
    IS_searching,
    data: vocabs,
    error: fetchVocabs_ERROR,
    IS_loadingMore,
    HAS_reachedEnd,
    unpaginated_COUNT: totalFilteredVocab_COUNT,
    LOAD_more,
    ADD_toDisplayed,
    REMOVE_fromDisplayed,
  } = USE_vocabs({
    type: fetch_TYPE,
    targetList_ID: list?.id,
    search: debouncedSearch,
    IS_debouncing,
  });

  const data = useMemo(() => {
    if (fetchVocabs_ERROR?.value || IS_searching) return [];
    return vocabs;
  }, [IS_searching, fetchVocabs_ERROR, vocabs]);

  console.log(fetchVocabs_ERROR);

  const Footer = () => {
    if (error?.value) {
      return <Error_BLOCK paragraph={error?.msg} />;
    } else if (IS_searching) {
      return (
        <View style={{ gap: 12, flex: 1 }}>
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
          <Skeleton_BLOCK />
        </View>
      );
    } else return listFooter_EL;
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
      data={vocabs || []}
      _ref={_ref}
      renderItem={({ item }) => Vocab_BTN(item)}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={highlightedVocab_ID}
      ListHeaderComponent={
        <VocabsFlatlistHeader_SECTION
          search={search}
          totalVocabs={totalFilteredVocab_COUNT}
          IS_searching={IS_searching}
          list_NAME={list?.name}
          vocabResults_COUNT={totalFilteredVocab_COUNT}
        />
      }
      ListFooterComponent={
        <BottomAction_BLOCK
          type="vocabs"
          createBtn_ACTION={OPEN_createVocabModal}
          {...{
            search,
            IS_debouncing,
            IS_loadingMore,
            HAS_reachedEnd,
            LOAD_more,
            RESET_search,
          }}
          totalFilteredResults_COUNT={totalFilteredVocab_COUNT}
        />
      }
    />
  );
}
