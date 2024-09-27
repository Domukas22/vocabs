//
//
//

import { Button, Text, View } from "react-native";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import {
  MyVocab_MODAL,
  MyVocabDisplaySettings_MODAL,
  MyVocabs_HEADER,
  MyVocabs_SUBNAV,
  MyVocabs_FLATLIST,
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
// import Btn from "@/src/components/Btn/Btn";
// import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
// import Header from "@/src/components/Header/Header";
// import {
//   ICON_3dots,
//   ICON_arrow,
//   ICON_displaySettings,
//   ICON_X,
// } from "@/src/components/icons/icons";
// import { TranslationCreation_PROPS, Vocab_MODEL } from "@/src/db/models";
// import { useEffect, useMemo, useState } from "react";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import { MyVocabDisplaySettings_PROPS, Vocab_MODEL } from "@/src/db/models";
import { useMemo, useState } from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

// import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";

// import { supabase } from "@/src/lib/supabase";
// import List_SKELETONS from "@/src/components/Skeletons/List_SKELETONS";
// import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";

// import { MyVocabDisplaySettings_PROPS } from "@/src/db/models";
// import Subnav from "@/src/components/Subnav/Subnav";
// import SearchBar from "@/src/components/SearchBar/SearchBar";
// import { USE_toggle } from "@/src/hooks/USE_toggle";
// import e3 from "@/src/components/Subnav/Variations/PrivateVocabs_SUBNAV";
// import PrivateVocabDisplaySettings_MODAL from "@/src/components/Modals/Big_MODAL/Variations/PrivateVocabDisplaySettings_MODAL/PrivateVocabDisplaySettings_MODAL";
// import PrivateVocab_MODAL from "@/src/components/Modals/Vocab_MODALS/PrivateVocab_MODAL/PrivateVocab_MODAL";
// import { useTranslation } from "react-i18next";
// import Private_VOCAB from "@/src/components/Vocab/Private_VOCAB/Private_VOCAB";

// import { MyColors } from "@/src/constants/MyColors";

export default function SingleList_PAGE() {
  const router = useRouter();
  const { selected_LIST } = USE_selectedList();
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);
  const [SHOW_listSettingsModal, TOGGLE_listSettingsModal] = USE_toggle(false);
  const { user } = USE_auth();

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>(
    selected_LIST?.vocabs || []
  );
  // // const [filtered_VOCABS, SET_filteredVocabs] = useState<Vocab_MODEL[]>(vocabs);
  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>(
    undefined
  );
  const [highlightedVocab_ID, SET_highlightedVocabId] = useState("");
  const [IS_listNameHighlighted, SET_isListNameHightighted] = useState(false);

  const [displaySettings, SET_displaySettings] =
    useState<MyVocabDisplaySettings_PROPS>({
      SHOW_image: false,
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
      sorting: "difficulty",
      sortDirection: "ascending",
      search: "",
      difficultyFilters: [],
    });

  const HIGHLIGHT_vocab = (id: string) => {
    if (!highlightedVocab_ID) {
      SET_highlightedVocabId(id);
      setTimeout(() => {
        SET_highlightedVocabId("");
      }, 2000);
    }
  };
  const HIGHLIGHT_listName = () => {
    if (!IS_listNameHighlighted) {
      SET_isListNameHightighted(true);
      setTimeout(() => {
        SET_isListNameHightighted(false);
      }, 2000);
    }
  };
  function HANDLE_vocabModal({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) {
    if (!clear && vocab) {
      SET_targetVocab(vocab);
      TOGGLE_vocabModal();
    } else if (clear) {
      SET_targetVocab(undefined);
      TOGGLE_vocabModal();
    }
  }

  // const filtered_VOCABS = useMemo(
  //   () => filtered_VOCABS({ vocabs, settings: displaySettings }),
  //   [displaySettings, vocabs]
  // );

  console.log("LIST pageds");

  return (
    <Page_WRAP>
      <MyVocabs_HEADER
        list_NAME={selected_LIST?.name && selected_LIST.name}
        btnBack_ACTION={() => router.back()}
        btnDots_ACTION={TOGGLE_listSettingsModal}
        IS_listNameHighlighted={IS_listNameHighlighted}
      />
      <MyVocabs_SUBNAV
        search={displaySettings.search}
        SET_search={(val: string) =>
          SET_displaySettings((prev) => ({ ...prev, search: val }))
        }
        {...{
          TOGGLE_displaySettings,
          HANDLE_vocabModal,
        }}
      />
      {vocabs && vocabs.length > 0 ? (
        <MyVocabs_FLATLIST
          vocabs={vocabs}
          SHOW_bottomBtn={true}
          {...{
            highlightedVocab_ID,
            TOGGLE_vocabModal,
            HANDLE_vocabModal,
            displaySettings,
          }}
        />
      ) : null}
      <MyVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
      />

      <MyVocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        vocab={target_VOCAB}
        selected_LIST={selected_LIST}
        SET_vocabs={SET_vocabs}
        HIGHLIGHT_vocab={HIGHLIGHT_vocab}
      />
      <ListSettings_MODAL
        list={selected_LIST}
        open={SHOW_listSettingsModal}
        TOGGLE_open={TOGGLE_listSettingsModal}
        user_id={user.id}
        backToIndex={() => router.back()}
        HIGHLIGHT_listName={HIGHLIGHT_listName}
      />
    </Page_WRAP>
  );
}

// function FILTER_vocabs({
//   vocabs,
//   settings,
// }: {
//   vocabs: Vocab_MODEL[];
//   settings: MyVocabDisplaySettings_PROPS;
// }) {
//   const { search, sorting, sortDirection, frontTrLang_ID, difficultyFilters } =
//     settings;

//   let result = [...vocabs];

//   // Filter by difficulties
//   if (difficultyFilters && difficultyFilters.length > 0) {
//     result = result.filter((vocab) =>
//       difficultyFilters.includes(vocab?.difficulty)
//     );
//   }

//   // Filter by search query (matching description or translations)
//   if (search) {
//     const searchLower = search.toLowerCase();
//     result = result.filter(
//       (vocab) =>
//         vocab.description?.toLowerCase().includes(searchLower) ||
//         vocab.translations?.some((translation) =>
//           translation.text?.toLowerCase().includes(searchLower)
//         )
//     );
//   }

//   // Sorting
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
