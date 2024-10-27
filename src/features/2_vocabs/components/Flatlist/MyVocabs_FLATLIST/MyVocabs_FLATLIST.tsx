//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";

import { useTranslation } from "react-i18next";
import MyVocab from "../../Vocab/My_VOCAB/My_VOCAB";
import React, { useEffect, useMemo, useState } from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";

import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";

import { tr_PROPS } from "@/src/db/props";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { withObservables } from "@nozbe/watermelondb/react";
import FETCH_vocabs, { VocabFilter_PROPS } from "../../../utils/FETCH_vocabs";
import Vocab from "../../Vocab/Vocab";
import { NativeScrollEvent, NativeSyntheticEvent, View } from "react-native";
import FetchVocabs_QUERY from "../../../utils/FetchVocabs_QUERY";
import USE_displaySettings from "@/src/hooks/USE_displaySettings/USE_displaySettings";
import USE_observedVocabs, {
  USE_observeVocabs,
} from "@/src/features/1_lists/hooks/USE_observeVocabs";
import { Query } from "@nozbe/watermelondb";
import { HEADER_MARGIN } from "@/src/constants/globalVars";

export default function MyVocabs_FLATLIST({
  vocabs,
  SHOW_bottomBtn,
  highlightedVocab_ID,
  HANDLE_updateModal,
  PREPARE_vocabDelete,
  TOGGLE_createVocabModal,
  listHeader_EL,
  onScroll,
}: {
  vocabs: Vocab_MODEL[] | undefined;
  SHOW_bottomBtn: React.ReactNode;
  highlightedVocab_ID: string;
  listHeader_EL: React.ReactNode;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;
  TOGGLE_createVocabModal: () => void;
  PREPARE_vocabDelete?: (id: string) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}) {
  const { t } = useTranslation();

  return (
    <Styled_FLATLIST
      {...{ onScroll }}
      data={vocabs}
      renderItem={({ item }) => {
        return (
          <SwipeableExample
            rightBtn_ACTION={() => {
              if (PREPARE_vocabDelete) PREPARE_vocabDelete(item.id);
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
      style={{ marginTop: HEADER_MARGIN || 68 }}
      keyExtractor={(item) => "Vocab" + item.id}
      ListHeaderComponent={listHeader_EL}
      ListFooterComponent={
        SHOW_bottomBtn ? (
          <Btn
            text={t("btn.createVocab")}
            iconLeft={<ICON_X color="primary" />}
            type="seethrough_primary"
            onPress={TOGGLE_createVocabModal}
          />
        ) : null
      }
    />
  );
}
