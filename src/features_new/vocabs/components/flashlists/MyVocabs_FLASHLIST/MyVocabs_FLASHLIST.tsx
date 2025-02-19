//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import React, { useRef } from "react";
import { Vocab_CARD } from "../../../../../features/vocabs/vocabList/Vocabs_LIST/helpers";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { z_USE_myVocabs } from "../../../hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { Vocab_TYPE } from "../../../types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";

export default function MyVocabs_FLASHLIST({
  IS_debouncing = false,
  OPEN_updateVocabModal = () => {},
  handleScroll = () => {},
  Header,
  Footer,
}: {
  IS_debouncing: boolean;
  OPEN_updateVocabModal?: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
}) {
  const list_REF = useRef<FlashList<any>>(null);
  const { z_currentActions } = z_USE_currentActions();

  const {
    z_myVocabs,
    z_myVocabsFetch_TYPE,
    z_myVocabsLoading_STATE,
    z_myVocabs_ERROR: error,
    z_myVocabsHighlighted_ID,
  } = z_USE_myVocabs();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      data={
        IS_debouncing ||
        error ||
        (z_myVocabsLoading_STATE !== "none" &&
          z_myVocabsLoading_STATE !== "error" &&
          z_myVocabsLoading_STATE !== "loading_more")
          ? []
          : z_myVocabs || []
      }
      flashlist_REF={list_REF}
      renderItem={({ item }: { item: Vocab_TYPE }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE={"private"}
          fetch_TYPE={z_myVocabsFetch_TYPE}
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          highlighted={z_myVocabsHighlighted_ID === item.id}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[z_myVocabsHighlighted_ID, z_currentActions]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
