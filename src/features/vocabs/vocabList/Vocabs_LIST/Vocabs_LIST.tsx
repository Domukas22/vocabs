//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";
import { FlashList } from "@shopify/flash-list";
import { NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Vocab_TYPE } from "../../types";
import React from "react";
import { USE_openVocabs } from "../USE_openVocabs/USE_openVocabs";
import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";

export function Vocab_LIST({
  vocabs,
  Header,
  Footer,
  flashlist_REF,
  highlightedVocab_ID,
  Vocab_CARD,
  onScroll,
  HIDE_vocabs = false,
  current_ACTIONS = [],
}: {
  Header: React.JSX.Element;
  Footer: React.JSX.Element;
  Vocab_CARD: React.MemoExoticComponent<
    ({
      vocab,
      openVocab_IDs,
      TOGGLE_vocab,
    }: {
      vocab: Vocab_TYPE;
      openVocab_IDs: Set<string>;
      TOGGLE_vocab: Function;
    }) => React.JSX.Element
  >;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  highlightedVocab_ID: string | undefined;
  flashlist_REF?: React.RefObject<FlashList<any>>;

  HIDE_vocabs: boolean;
  vocabs: Vocab_TYPE[] | undefined;
  current_ACTIONS: currentVocabAction_TYPE[];
}) {
  const { openVocab_IDs, TOGGLE_vocab } = USE_openVocabs();

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={HIDE_vocabs ? [] : vocabs || []}
      flashlist_REF={flashlist_REF}
      renderItem={({ item }) =>
        Vocab_CARD ? (
          <Vocab_CARD vocab={item} {...{ openVocab_IDs, TOGGLE_vocab }} />
        ) : null
      }
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={[highlightedVocab_ID, openVocab_IDs, current_ACTIONS]}
      ListHeaderComponent={Header}
      ListFooterComponent={Footer}
    />
  );
}
