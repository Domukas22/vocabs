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
