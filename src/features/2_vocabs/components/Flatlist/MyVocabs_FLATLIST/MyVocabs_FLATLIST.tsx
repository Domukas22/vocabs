//
//
//

import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";

import MyVocab from "../../Vocab/My_VOCAB/My_VOCAB";
import React from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";

export default function MyVocabs_FLATLIST({
  vocabs,

  IS_searching = false,
  highlightedVocab_ID,
  HANDLE_updateModal,
  PREPARE_vocabDelete,

  listHeader_EL,
  listFooter_EL,
  onScroll,
}: {
  vocabs: Vocab_MODEL[] | undefined;

  highlightedVocab_ID?: string;
  IS_searching: boolean;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;

  PREPARE_vocabDelete?: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      // data={vocabs}
      data={vocabs}
      keyExtractor={(item, index) => "Vocab" + item.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={listFooter_EL}
      extraData={IS_searching}
      renderItem={({ item }) => {
        return (
          <SwipeableExample
            rightBtn_ACTION={() => {
              if (PREPARE_vocabDelete) PREPARE_vocabDelete(item);
            }}
          >
            <MyVocab
              vocab={item}
              highlighted={highlightedVocab_ID === item.id}
              {...{ HANDLE_updateModal }}
            />
          </SwipeableExample>
        );
      }}
    />
  );
}
