//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { DisplaySettings_PROPS, Vocab_MODEL } from "@/src/db/models";
import { useTranslation } from "react-i18next";
import MyVocab from "../../Vocab/My_VOCAB/My_VOCAB";
import React, { useEffect, useState } from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import USE_searchedVocabs from "../../../hooks/USE_searchedVocabs";
import USE_filteredVocabs from "../../../hooks/USE_filteredVocabs";
import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";
import USE_zustand from "@/src/zustand";

export default function MyVocabs_FLATLIST({
  all_VOCABS,
  highlightedVocab_ID,
  SHOW_bottomBtn,
  TOGGLE_createVocabModal,
  HANDLE_updateModal,
  displaySettings,
  PREPARE_vocabDelete,
  search,
}: {
  all_VOCABS: Vocab_MODEL[] | undefined;
  SHOW_bottomBtn: React.ReactNode;
  TOGGLE_createVocabModal: () => void;
  highlightedVocab_ID: string;
  HANDLE_updateModal: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  };
  displaySettings: DisplaySettings_PROPS;
  PREPARE_vocabDelete?: (id: string) => void;
  search: string;
}) {
  const { z_printed_VOCABS, z_display_SETTINGS } = USE_zustand();
  const { t } = useTranslation();
  const { searched_VOCABS, ARE_vocabsSearching } = USE_searchedVocabs({
    vocabs: all_VOCABS || [],
    search,
  });

  const { filtered_VOCABS, ARE_vocabsFiltering } = USE_filteredVocabs({
    vocabs: searched_VOCABS,
    displaySettings,
  });

  const [loading, SET_loading] = useState(false);

  useEffect(() => {
    const filterVocabs = async () => {
      SET_loading(true);

      SET_loading(false);
    };

    filterVocabs();
  }, [search, z_display_SETTINGS, all_VOCABS]);

  if (ARE_vocabsSearching || ARE_vocabsFiltering) return <List_SKELETONS />;
  if (
    all_VOCABS &&
    all_VOCABS?.length > 0 &&
    !ARE_vocabsSearching &&
    !ARE_vocabsFiltering &&
    searched_VOCABS.length > 0 &&
    filtered_VOCABS.length > 0
  ) {
    return (
      <Styled_FLATLIST
        data={filtered_VOCABS}
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
                displaySettings={displaySettings}
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
  if (
    !ARE_vocabsSearching &&
    !ARE_vocabsFiltering &&
    filtered_VOCABS.length === 0
  ) {
    return (
      <EmptyFlatList_BOTTM
        // emptyBox_TEXT={t("label.thisListIsEmpty")}
        emptyBox_TEXT={
          search !== "" ||
          displaySettings.langFilters.length > 0 ||
          displaySettings.difficultyFilters.length > 0
            ? t("label.noVocabsFound")
            : t("label.thisListIsEmpty")
        }
        btn_TEXT={t("btn.createVocab")}
        btn_ACTION={TOGGLE_createVocabModal}
      />
    );
  }
}

function GET_filteredVocabs({ vocabs, displaySettings }) {}
