//
//
//

import BottomAction_BLOCK from "@/src/components/1_grouped/blocks/BottomAction_BLOCK";
import Error_BLOCK from "@/src/components/1_grouped/blocks/Error_BLOCK";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { VocabsFlatlistHeader_SECTION } from "../../components";
import { Vocab_TYPE } from "../../types";
import { Vocab_CARD } from "../Vocabs_LIST/helpers";
import { VocabsSkeleton_BLOCK } from "../Vocabs_LIST/helpers/VocabsSkeleton_BLOCK/VocabsSkeleton_BLOCK";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "../USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import React, { useState, useCallback, useMemo, useEffect } from "react";

interface GET_vocabListComponents_PROPS {
  IS_debouncing: boolean;
  debouncedSearch: string;
  search: string;
  loading_STATE: loadingState_TYPES;
  list_NAME: string;
  unpaginated_COUNT: number;
  vocabs_ERROR: General_ERROR | undefined;
  HAS_reachedEnd: boolean;
  highlighted_ID: string;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  LOAD_moreVocabs: () => void;
  OPEN_modalCreateVocab: () => void;
  OPEN_modalUpdateVocab: (vocab: Vocab_TYPE) => void;
  RESET_search: () => void;
}

export function GET_vocabListComponents({
  IS_debouncing,
  debouncedSearch,
  search,
  loading_STATE,
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
  RESET_search = () => {},
}: GET_vocabListComponents_PROPS) {
  const Flashlist_HEADER = React.memo(() => (
    <VocabsFlatlistHeader_SECTION
      IS_debouncing={IS_debouncing}
      debouncedSearch={debouncedSearch}
      search={search}
      loading_STATE={loading_STATE}
      list_NAME={list_NAME}
      unpaginated_COUNT={unpaginated_COUNT}
      HAS_error={!!vocabs_ERROR}
    />
  ));

  const Flashlist_FOOTER = React.memo(() => {
    if (vocabs_ERROR)
      return (
        <Error_BLOCK
          paragraph={vocabs_ERROR?.user_MSG || "Something went wrong"}
        />
      );

    if (
      IS_debouncing ||
      (loading_STATE !== "none" && loading_STATE !== "loading_more")
    ) {
      return <VocabsSkeleton_BLOCK />;
    } else {
      return (
        <BottomAction_BLOCK
          type="vocabs"
          createBtn_ACTION={OPEN_modalCreateVocab}
          LOAD_more={LOAD_moreVocabs}
          RESET_search={RESET_search}
          totalFilteredResults_COUNT={unpaginated_COUNT}
          {...{
            debouncedSearch,
            loading_STATE,
            HAS_reachedEnd,
            IS_debouncing,
          }}
        />
      );
    }
  });

  ///////////////////////////////////
  //

  const Card = React.memo(
    ({
      vocab,
      openVocab_IDs,
      TOGGLE_vocab,
    }: {
      vocab: Vocab_TYPE;
      openVocab_IDs: Set<string>;
      TOGGLE_vocab: (vocab_ID: string, val?: boolean) => void;
    }) => (
      <Vocab_CARD
        {...{
          vocab,
          list_TYPE,
          fetch_TYPE,
          openVocab_IDs,
          TOGGLE_vocab,
        }}
        highlighted={highlighted_ID === vocab.id}
        IS_open={openVocab_IDs.has(vocab?.id)} // This will now reflect the updated Set reference
        TOGGLE_open={(val?: boolean) => TOGGLE_vocab(vocab.id, val)}
      />
    )
  );

  return { Flashlist_HEADER, Flashlist_FOOTER, Card };
}
