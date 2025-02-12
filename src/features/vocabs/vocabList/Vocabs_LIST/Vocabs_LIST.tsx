//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { Skeleton_BLOCK } from "@/src/components/1_grouped/blocks/Skeleton_BLOCK";
import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import SwipeableExample from "@/src/components/3_other/SwipeableExample/SwipeableExample";
import { MyColors } from "@/src/constants/MyColors";
import { Error_PROPS, General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { FlashList } from "@shopify/flash-list";
import { NativeSyntheticEvent, NativeScrollEvent, View } from "react-native";
import { Deleted_VOCAB, VocabsFlatlistHeader_SECTION } from "../../components";
import { USE_vocabs_FETCH_TYPES } from "../../functions/1_myVocabs/fetch/FETCH_myVocabs/types";
import { VocabsSkeleton_BLOCK } from "./helpers/VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";
import { Vocab_TYPE } from "../../types";
import My_VOCAB from "./helpers/VocabCards/MyVocab_CARD/MyVocab_CARD";
import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";

export function Vocab_LIST({
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
  PREPARE_vocabDelete: (vocab: Vocab_TYPE) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  SELECT_forRevival?: (vocab: Vocab_TYPE) => void;
  HANDLE_updateModal?: (params: {
    clear?: boolean;
    vocab?: Vocab_TYPE;
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

  vocabs: Vocab_TYPE[] | undefined;
  vocabs_ERROR: General_ERROR | undefined;
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
      return <VocabsSkeleton_BLOCK />;
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

  const Vocab_BTN = (vocab: Vocab_TYPE) =>
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

  if (vocabs_ERROR)
    return (
      <View style={{ padding: 12, backgroundColor: MyColors.fill_bg, flex: 1 }}>
        <Error_BLOCK
          paragraph={vocabs_ERROR?.message}
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
