//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";

import { useTranslation } from "react-i18next";
import MyVocab from "../../Vocab/My_VOCAB/My_VOCAB";
import React, { useEffect, useMemo, useState } from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";

import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

export default function MyVocabs_FLATLIST({
  vocabs,
  SHOW_bottomBtn,
  IS_searching = false,
  highlightedVocab_ID,
  HANDLE_updateModal,
  PREPARE_vocabDelete,
  TOGGLE_createVocabModal,
  listHeader_EL,
  listFooter_EL,
  onScroll,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  SHOW_bottomBtn: React.ReactNode;
  highlightedVocab_ID: string;
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
  TOGGLE_createVocabModal: () => void;
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
