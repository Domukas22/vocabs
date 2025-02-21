//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import React, { useRef } from "react";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { z_USE_publicVocabs } from "../../../hooks/zustand/z_USE_publicVocabs/z_USE_publicVocabs";
import { Vocab_TYPE } from "../../../types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { Vocab_CARD } from "../components/VocabCards/Vocab_CARD/Vocab_CARD";

export default function PublicVocabs_FLASHLIST({
  IS_debouncing = false,
  OPEN_copyVocabModal = () => {},
  handleScroll = () => {},
  Header,
  Footer,
}: {
  IS_debouncing: boolean;
  OPEN_copyVocabModal?: () => void;
  handleScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
}) {
  const flashlist_REF = useRef<FlashList<any>>(null);
  const { z_currentActions } = z_USE_currentActions();

  const {
    z_publicVocabs,
    z_publicVocabsFetch_TYPE,
    z_publicVocabsLoading_STATE,
    z_publicVocabs_ERROR: error,
  } = z_USE_publicVocabs();

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      data={
        IS_debouncing ||
        error ||
        (z_publicVocabsLoading_STATE !== "none" &&
          z_publicVocabsLoading_STATE !== "error" &&
          z_publicVocabsLoading_STATE !== "loading_more")
          ? []
          : z_publicVocabs || []
      }
      flashlist_REF={flashlist_REF}
      renderItem={({ item }: { item: Vocab_TYPE }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE="public"
          fetch_TYPE={z_publicVocabsFetch_TYPE}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[z_currentActions]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
