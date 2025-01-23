//
//
//

import Styled_FLASHLIST from "@/src/components/3_other/Styled_FLASHLIST/Styled_FLASHLIST";

import React from "react";

import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Deleted_VOCAB } from "../../vocabCards/Deleted_VOCAB/Deleted_VOCAB";

export function DeletedVocabs_FLATLIST({
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
        return <Deleted_VOCAB vocab={item} {...{ SELECT_forRevival }} />;
      }}
    />
  );
}
