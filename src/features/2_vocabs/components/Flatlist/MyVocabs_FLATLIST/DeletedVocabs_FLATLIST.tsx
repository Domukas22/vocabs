//
//
//

import Styled_FLASHLIST from "@/src/components/Styled_FLATLIST/Styled_FLASHLIST/Styled_FLASHLIST";

import React from "react";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import Deletedvocab from "../../Vocab/My_VOCAB/Deleted_VOCAB";

export default function DeletedVocabs_FLATLIST({
  vocabs,
  IS_searching = false,
  listHeader_EL,
  listFooter_EL,
  onScroll,
  SELECT_forRevival,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  IS_searching: boolean;
  listHeader_EL: React.ReactNode;
  listFooter_EL: React.ReactNode;
  SELECT_forRevival: (vocab: Vocab_MODEL) => void;
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
        return <Deletedvocab vocab={item} {...{ SELECT_forRevival }} />;
      }}
    />
  );
}
