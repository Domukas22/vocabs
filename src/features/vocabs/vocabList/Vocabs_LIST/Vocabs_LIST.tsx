//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Vocab_TYPE } from "../../types";
import React from "react";

export function Vocab_LIST({
  vocabs,
  Header,
  Footer,
  flashlist_REF,
  highlightedVocab_ID,
  Vocab_CARD,
  onScroll,
  HIDE_vocabs = false,
}: {
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
  Vocab_CARD: ({ vocab }: { vocab: Vocab_TYPE }) => React.JSX.Element;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  highlightedVocab_ID: string | undefined;
  flashlist_REF?: React.RefObject<FlashList<any>>;

  HIDE_vocabs: boolean;
  vocabs: Vocab_TYPE[] | undefined;
}) {
  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={HIDE_vocabs ? [] : vocabs || []}
      flashlist_REF={flashlist_REF}
      renderItem={({ item }) => <Vocab_CARD vocab={item} />}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={highlightedVocab_ID}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
