//
//
//

import {
  List_MODEL,
  TranslationCreation_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import MyList_BTN from "../../MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "../Styled_FLATLIST/Styled_FLATLIST";
import React, { useEffect, useState } from "react";
import db, { Lists_DB, Vocabs_DB } from "@/src/db";
import { Styled_TEXT } from "../../Styled_TEXT";

import { withObservables } from "@nozbe/watermelondb/react";
import Btn from "../../btn/btn";
import { ICON_X } from "../../icons/icons";
import Vocab from "../../Vocab/Vocab";
import { View } from "react-native";
import { Q } from "@nozbe/watermelondb";
import FETCH_vocabs, {
  VocabFilter_PROPS,
} from "@/src/db/actions/vocabs/FETCH_vocabs";

interface SingleListVocabs_PROPS {
  selected_LIST: List_MODEL;
  EDIT_vocab: ({
    vocab,
    translations,
  }: {
    vocab: Vocab_MODEL;
    translations: TranslationCreation_PROPS[];
  }) => void;
  displayProps: {
    image: boolean;
    listName: boolean;
    desc: boolean;
    flags: boolean;
    difficulty: boolean;
    frontLangId: string;
  };
  vocabs: Vocab_MODEL[];
}

// Define the component
function _Vocabs({
  displayProps,
  EDIT_vocab,
  vocabs, // Use observed vocabs her
  selected_LIST,
}: SingleListVocabs_PROPS) {
  return vocabs ? (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => (
        <View>
          <Vocab
            vocab={item}
            displayProps={displayProps}
            EDIT_vocab={EDIT_vocab}
            selected_LIST={selected_LIST}
          />
          {/* <Styled_TEXT>list id is: {item.list}</Styled_TEXT> */}
        </View>
      )}
      keyExtractor={(item) => item.id}
    />
  ) : (
    <Styled_TEXT>Loading...</Styled_TEXT>
  );
}
const enhance = withObservables(
  ["filters"],
  ({ filters }: { filters: VocabFilter_PROPS }) => ({
    vocabs: FETCH_vocabs(filters),
    // vocabs: Vocabs_DB.query(),
    // vocabs: Vocabs_DB,
    // vocabs,
  })
);

const ListOfVocabs = enhance(_Vocabs);
export default ListOfVocabs;
