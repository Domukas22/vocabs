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

  PREPARE_vocabDelete?: (id: string) => void;
  search: string;
}) {
  const { z_printed_VOCABS, z_display_SETTINGS, z_SET_printedVocabs } =
    USE_zustand();
  const { t } = useTranslation();

  const [loading, SET_loading] = useState(false);

  console.log(z_printed_VOCABS);

  useEffect(() => {
    SET_loading(true);
    const searched = GET_searchedVocabs({ vocabs: all_VOCABS, search });
    const filtered = GET_filteredVocabs({
      vocabs: searched,
      displaySettings: z_display_SETTINGS,
    });
    SET_loading(false);
    z_SET_printedVocabs(filtered);
  }, [search, z_display_SETTINGS]);

  if (loading) return <List_SKELETONS />;
  if (
    all_VOCABS &&
    all_VOCABS?.length > 0
    // &&
    // !ARE_vocabsSearching &&
    // !ARE_vocabsFiltering &&
    // searched_VOCABS.length > 0 &&
    // filtered_VOCABS.length > 0
  ) {
    return (
      <Styled_FLATLIST
        data={z_printed_VOCABS}
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
  if (!loading && z_printed_VOCABS.length === 0) {
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

function GET_filteredVocabs({ vocabs, displaySettings }) {
  let result = [...vocabs];

  const { sorting, sortDirection, difficultyFilters, langFilters } =
    displaySettings;

  // Apply difficulty filters
  if (difficultyFilters && difficultyFilters.length > 0) {
    result = result.filter((vocab) =>
      difficultyFilters.includes(vocab?.difficulty)
    );
  }

  // Apply langauge filters
  if (langFilters && langFilters.length > 0) {
    result = result.filter((vocab) => {
      // Get the unique language IDs from the vocab's translations
      const vocabLangIds = vocab.translations?.map((tr) => tr.lang_id) || [];

      // Check if every langFilter is present in vocabLangIds
      return langFilters.every((langId) => vocabLangIds.includes(langId));
    });
  }

  // Apply sorting
  if (sorting) {
    result = result.sort((a, b) => {
      let comparison = 0;

      switch (sorting) {
        case "difficulty":
          comparison = a.difficulty - b.difficulty;
          break;
        case "date":
          comparison =
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          break;
        case "shuffle":
          comparison = Math.random() - 0.5; // Randomize order
          break;
        default:
          break;
      }

      // Apply sorting direction
      if (sortDirection === "descending") {
        comparison = -comparison;
      }

      return comparison;
    });
  }

  return result;
}
function GET_searchedVocabs({ vocabs, search }) {
  const result = vocabs?.filter(
    (vocab) =>
      vocab.description?.toLowerCase().includes(search.toLowerCase().trim()) ||
      vocab.translations?.some((tr) =>
        tr.text.toLowerCase().includes(search.toLowerCase().trim())
      )
  );

  return result;
}
