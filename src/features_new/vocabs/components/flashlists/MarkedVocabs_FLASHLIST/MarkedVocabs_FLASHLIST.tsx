//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo, useRef } from "react";

import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { z_USE_myVocabs } from "../../../hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { Vocab_TYPE } from "../../../types";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";
import { Vocab_CARD } from "../_parts/Vocab_CARD/Vocab_CARD";
import { z_USE_markedVocabs } from "../../../hooks/zustand/z_USE_markedVocabs/z_USE_markedVocabs";

export default function MarkedVocabs_FLASHLIST({
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
  const flashlist_REF = useRef<FlashList<any>>(null);
  const { z_currentActions } = z_USE_currentActions();

  const { z_vocabs, z_loading_STATE, z_error } = z_USE_markedVocabs();

  const data = useMemo(
    () =>
      IS_debouncing ||
      z_error ||
      (z_loading_STATE !== "none" &&
        z_loading_STATE !== "error" &&
        z_loading_STATE !== "loading_more")
        ? []
        : z_vocabs || [],
    [z_loading_STATE, z_vocabs, IS_debouncing, z_error]
  );

  return (
    <Styled_FLASHLIST
      onScroll={handleScroll}
      data={data}
      flashlist_REF={flashlist_REF}
      renderItem={({ item }: { item: Vocab_TYPE }) => (
        <Vocab_CARD
          vocab={item}
          list_TYPE="private"
          fetch_TYPE={"marked"}
          OPEN_updateVocabModal={OPEN_updateVocabModal}
          highlighted={false}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[z_currentActions]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
