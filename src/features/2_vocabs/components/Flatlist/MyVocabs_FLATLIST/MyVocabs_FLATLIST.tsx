//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";

import { useTranslation } from "react-i18next";
import MyVocab from "../../Vocab/My_VOCAB/My_VOCAB";
import React, { useEffect, useState } from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";

import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";
import USE_zustand from "@/src/zustand";
import { tr_PROPS } from "@/src/db/props";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { withObservables } from "@nozbe/watermelondb/react";
import FETCH_vocabs, { VocabFilter_PROPS } from "../../../utils/FETCH_vocabs";
import Vocab from "../../Vocab/Vocab";
import { View } from "react-native";
import FetchVocabs_QUERY from "../../../utils/FetchVocabs_QUERY";

export default function MyVocabs_FLATLIST({
  filters,
  highlightedVocab_ID,
  SHOW_bottomBtn,
  TOGGLE_createVocabModal,
  HANDLE_updateModal,
  PREPARE_vocabDelete,
  search,
}: {
  filters: VocabFilter_PROPS;
  SHOW_bottomBtn: React.ReactNode;
  TOGGLE_createVocabModal: () => void;
  highlightedVocab_ID: string;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => void;

  PREPARE_vocabDelete?: (id: string) => void;
  search: string;
}) {
  const { z_display_SETTINGS } = USE_zustand();
  const { t } = useTranslation();
  const _vocabs = USE_observedVocabs(filters);

  if (_vocabs && _vocabs?.length > 0) {
    return (
      <Styled_FLATLIST
        data={_vocabs}
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
        keyExtractor={(item) => "Vocab" + item.id}
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
  if (_vocabs?.length === 0) {
    return (
      <EmptyFlatList_BOTTM
        // emptyBox_TEXT={t("label.thisListIsEmpty")}
        emptyBox_TEXT={
          search !== "" ||
          z_display_SETTINGS.langFilters.length > 0 ||
          z_display_SETTINGS.difficultyFilters.length > 0
            ? t("label.noVocabsFound")
            : t("label.thisListIsEmpty")
        }
        btn_TEXT={t("btn.createVocab")}
        btn_ACTION={TOGGLE_createVocabModal}
      />
    );
  }
}

function USE_observedVocabs(filters: VocabFilter_PROPS) {
  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[] | undefined>(undefined);

  useEffect(() => {
    const quries = FetchVocabs_QUERY(filters);
    const query = quries.observe();

    const subscription = query.subscribe({
      next: (updated_VOCABS) => {
        SET_vocabs(updated_VOCABS?.length > 0 ? updated_VOCABS : undefined); // Set the first item or undefined if empty
      },
    });

    // No need for explicit unsubscribe; Watermelon handles this
    return () => subscription.unsubscribe(); // Clean up the subscription
  }, [filters]);

  return vocabs;
}
