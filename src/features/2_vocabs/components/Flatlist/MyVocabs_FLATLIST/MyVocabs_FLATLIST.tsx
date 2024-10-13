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

function _MyVocabs_FLATLIST({
  list_id,
  vocabs,
  highlightedVocab_ID,
  SHOW_bottomBtn,
  TOGGLE_createVocabModal,
  HANDLE_updateModal,
  PREPARE_vocabDelete,
  search,
}: {
  list_id: string;
  vocabs: Vocab_MODEL[];
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

  console.log("-----------------------------------------------------");
  console.log("TRS: ", vocabs?.[0]?.trs);

  const [loading, SET_loading] = useState(false);

  if (loading) return <List_SKELETONS />;

  if (vocabs && vocabs?.length > 0) {
    return (
      <Styled_FLATLIST
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
  if (!loading && vocabs?.length === 0) {
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

const enhance = withObservables(
  ["filters"],
  ({ filters }: { filters: VocabFilter_PROPS }) => ({
    // vocabs: Vocabs_DB.query(Q.where("list_id", list_id)),
    vocabs: FETCH_vocabs(filters),
  })
);

export const MyVocabs_FLATLIST = enhance(_MyVocabs_FLATLIST);

// function GET_filteredVocabs({ vocabs, displaySettings }) {
//   let result = [...vocabs];

//   const { sorting, sortDirection, difficultyFilters, langFilters } =
//     displaySettings;

//   // Apply difficulty filters
//   if (difficultyFilters && difficultyFilters.length > 0) {
//     result = result.filter((vocab) =>
//       difficultyFilters.includes(vocab?.difficulty)
//     );
//   }

//   // Apply langauge filters
//   if (langFilters && langFilters.length > 0) {
//     result = result.filter((vocab) => {
//       // Get the unique language IDs from the vocab's translations
//       const vocabLangIds = vocab.translations?.map((tr) => tr.lang_id) || [];

//       // Check if every langFilter is present in vocabLangIds
//       return langFilters.every((langId) => vocabLangIds.includes(langId));
//     });
//   }

//   // Apply sorting
//   if (sorting) {
//     result = result.sort((a, b) => {
//       let comparison = 0;

//       switch (sorting) {
//         case "difficulty":
//           comparison = a.difficulty - b.difficulty;
//           break;
//         case "date":
//           comparison =
//             new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
//           break;
//         case "shuffle":
//           comparison = Math.random() - 0.5; // Randomize order
//           break;
//         default:
//           break;
//       }

//       // Apply sorting direction
//       if (sortDirection === "descending") {
//         comparison = -comparison;
//       }

//       return comparison;
//     });
//   }

//   return result;
// }
// function GET_searchedVocabs({ vocabs, search }) {
//   const result = vocabs?.filter(
//     (vocab) =>
//       vocab.description?.toLowerCase().includes(search.toLowerCase().trim()) ||
//       vocab.translations?.some((tr) =>
//         tr.text.toLowerCase().includes(search.toLowerCase().trim())
//       )
//   );

//   return result;
// }
