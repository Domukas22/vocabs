//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import React, { useRef } from "react";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Vocab_TYPE } from "../../../types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { Vocab_CARD } from "../_parts/Vocab_CARD/Vocab_CARD";
import { General_ERROR } from "@/src/types/error_TYPES";
import { loadingState_TYPES } from "@/src/types/general_TYPES";
import { vocabFetch_TYPES } from "../../../functions/FETCH_vocabs/types";

export default function PublicVocabs_FLASHLIST({
  IS_debouncing = false,
  OPEN_copyVocabModal = () => {},
  handleScroll = () => {},
  Header,
  Footer,
  vocabs = [],
  fetch_TYPE,
  loading_STATE,
  error,
  highlighted_ID,
}: {
  IS_debouncing: boolean;
  OPEN_copyVocabModal?: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
  vocabs: Vocab_TYPE[];
  fetch_TYPE: vocabFetch_TYPES;
  loading_STATE: loadingState_TYPES;
  highlighted_ID: string;
  error: General_ERROR | undefined;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const { z_currentActions } = z_USE_currentActions();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      data={
        IS_debouncing ||
        error ||
        (loading_STATE !== "none" &&
          loading_STATE !== "error" &&
          loading_STATE !== "loading_more")
          ? []
          : vocabs || []
      }
      flashlist_REF={flashlist_REF}
      renderItem={({ item }: { item: Vocab_TYPE }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE="public"
          fetch_TYPE={fetch_TYPE}
          OPEN_vocabCopyModal={OPEN_copyVocabModal}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[z_currentActions]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
