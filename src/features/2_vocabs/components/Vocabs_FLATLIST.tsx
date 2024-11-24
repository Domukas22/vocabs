//
//
//
import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import React, { useMemo } from "react";

import Skeleton_VIEW from "@/src/components/Skeleton_VIEW";
import Error_SECTION from "@/src/components/Error_SECTION";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import MyVocab from "./Vocab/My_VOCAB/My_VOCAB";
import Deletedvocab from "./Vocab/My_VOCAB/Deleted_VOCAB";
import { FlashList } from "@shopify/flash-list";

export default function Vocabs_FLATLIST({
  vocabs,
  type = "normal",
  listHeader_EL,
  listFooter_EL,
  PREPARE_vocabDelete,
  onScroll,
  error,
  highlightedVocab_ID,
  HANDLE_updateModal,
  IS_searching = true,
  SELECT_forRevival = (vocab: Vocab_MODEL) => {},
  _ref,
}: {
  type: "normal" | "delete";
  vocabs: Vocab_MODEL[] | undefined;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  error: { value: boolean; msg: string };
  PREPARE_vocabDelete: (vocab: Vocab_MODEL) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  SELECT_forRevival?: (vocab: Vocab_MODEL) => void;
  IS_searching: boolean;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
  highlightedVocab_ID: string | undefined;
  _ref?: React.RefObject<FlashList<any>>;
}) {
  const data = useMemo(() => {
    if (error?.value || IS_searching) return [];
    return vocabs;
  }, [IS_searching, error?.value, vocabs]);

  const Footer = () => {
    if (error?.value) return <Error_SECTION paragraph={error?.msg} />;
    if (IS_searching) return <Skeleton_VIEW />;
    return listFooter_EL;
  };

  const Vocab_BTN = (vocab: Vocab_MODEL) =>
    type === "normal" ? (
      <SwipeableExample
        rightBtn_ACTION={() => {
          if (PREPARE_vocabDelete) PREPARE_vocabDelete(vocab);
        }}
      >
        <MyVocab
          vocab={vocab}
          highlighted={highlightedVocab_ID === vocab.id}
          {...{ HANDLE_updateModal }}
        />
      </SwipeableExample>
    ) : (
      <Deletedvocab vocab={vocab} {...{ SELECT_forRevival }} />
    );

  return (
    <Styled_FLASHLIST
      {...{ onScroll }}
      data={data}
      _ref={_ref}
      renderItem={({ item }) => Vocab_BTN(item)}
      keyExtractor={(item) => "Vocab" + item.id}
      extraData={highlightedVocab_ID}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={<Footer />}
    />
  );
}
