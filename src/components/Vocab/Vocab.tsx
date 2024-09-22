//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";

import { Vocab_MODEL, List_MODEL, Translation_MODEL } from "@/src/db/models";

import Vocab_FRONT from "./components/Vocab_FRONT/Vocab_FRONT";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { DisplaySettings_MODEL } from "@/src/db/models";
import Vocab_BACK from "./components/Vocab_BACK";

interface VocabProps {
  vocab: Vocab_MODEL;
  translations: Translation_MODEL[];
  displaySettings: DisplaySettings_MODEL;
  selected_LIST: List_MODEL;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export default function Vocab({
  vocab,
  translations,
  displaySettings,
  selected_LIST,
}: VocabProps) {
  const [open, TOGGLE_vocab] = USE_toggle(false);
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);

  function HANDLE_editDifficulty(difficulty: 1 | 2 | 3) {
    if (vocab.difficulty !== difficulty) {
      // UPDATE_vocabDifficulty({ vocab, difficulty });
      // TOGGLE_difficultyEdits();
    }
  }

  const frontText =
    translations?.find((tr) => tr.lang_id === displaySettings.frontLangId)
      ?.text || translations?.[0]?.text;

  return (
    <View
      style={[
        s.vocab,
        open && s.vocab_open,
        open && vocab.difficulty === 1 && s.vocab_open_difficulty_1,
        open && vocab.difficulty === 2 && s.vocab_open_difficulty_2,
        open && vocab.difficulty === 3 && s.vocab_open_difficulty_3,
      ]}
    >
      <View>
        <Vocab_FRONT
          visible={!open}
          vocab={vocab}
          displaySettings={displaySettings}
          onPress={TOGGLE_vocab}
          listName={selected_LIST.name}
        />
        {open ? (
          <Vocab_BACK
            vocab={vocab}
            selectedList_NAME={selected_LIST.name}
            TOGGLE_vocab={TOGGLE_vocab}
          />
        ) : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  vocab: {
    borderRadius: 12,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
  },
  vocab_open: {
    backgroundColor: MyColors.fill_bg,
  },
  vocab_open_difficulty_3: {
    borderColor: MyColors.border_difficulty_3,
  },
  vocab_open_difficulty_2: {
    borderColor: MyColors.border_difficulty_2,
  },
  vocab_open_difficulty_1: {
    borderColor: MyColors.border_difficulty_1,
  },

  bottomTr: {
    flexDirection: "row",
    minHeight: 60,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
  bottomVocabFlag_WRAP: {
    justifyContent: "center",
    alignItems: "center",
    height: 58,
    width: 50,
  },
  bottomVocab_TITLE: {
    color: MyColors.text_white,
    fontSize: 18,
    fontWeight: 500,
    paddingVertical: 16,
    flex: 1,
  },
  bottomText_WRAP: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: MyColors.border_white_005,
  },
});
