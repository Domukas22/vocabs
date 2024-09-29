//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import React, { useEffect, useMemo } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle";
import { MyVocabDisplaySettings_PROPS, Vocab_MODEL } from "@/src/db/models";
import Vocab_FRONT from "../components/Vocab_FRONT";

import USE_updateVocabDifficulty from "./hooks/USE_updateVocabDifficulty";
import VocabBack_TRs from "../components/VocabBack_TRs";
import VocabBack_DESC from "../components/VocabBack_DESC";
import Btn from "@/src/components/Btn/Btn";
import { ICON_difficultyDot, ICON_X } from "@/src/components/icons/icons";
import { useTranslation } from "react-i18next";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import MyVocabBack_BTNS from "./Components/MyVocabBack_BTNS/MyVocabBack_BTNS";
import MyVocabBackDifficultyEdit_BTNS from "./Components/MyVocabDifficultyEdit_BTNS/MyVocabDifficultyEdit_BTNS";

interface VocabProps {
  vocab: Vocab_MODEL;
  highlighted: boolean;
  displaySettings: MyVocabDisplaySettings_PROPS;
  HANDLE_vocabModal: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  };
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export default function My_VOCAB({
  vocab,
  highlighted,
  displaySettings,
  HANDLE_vocabModal,
}: VocabProps) {
  const [open, TOGGLE_open] = USE_toggle();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);

  const {
    // this needs to be here and not in the Vocab back, beacsue the color need sot update for the entire vocab
    UPDATE_privateVocabDifficulty,
    privateVocabDifficultyEdit_PROPS,
    updateDifficulty_ERROR,
  } = USE_updateVocabDifficulty();

  const { selected_LIST } = USE_selectedList();

  async function EDIT_vocabDifficulty(newDifficulty: 1 | 2 | 3) {
    if (
      !privateVocabDifficultyEdit_PROPS.loading &&
      vocab.difficulty !== newDifficulty
    ) {
      const result = await UPDATE_privateVocabDifficulty({
        list_id: selected_LIST.id,
        vocab_id: vocab.id,
        newDifficulty,
      });
      if (result.success) {
        TOGGLE_difficultyEdits();
      }
    }
  }

  const styles = useMemo(
    () => [
      s.vocab,
      open && s.vocab_open,
      open &&
        vocab.difficulty !== undefined &&
        s[`difficulty_${vocab.difficulty}`],
      highlighted && s.highlighted,
    ],
    [open, vocab.difficulty]
  );

  return (
    <View style={styles}>
      <Vocab_FRONT
        vocab_id={vocab.id}
        translations={vocab.translations}
        difficulty={vocab.difficulty}
        description={vocab.description}
        displaySettings={displaySettings}
        highlighted={highlighted}
        open={open}
        TOGGLE_open={TOGGLE_open}
      />
      {open && (
        <>
          <VocabBack_TRs
            TRs={vocab?.translations}
            difficulty={vocab.difficulty}
          />
          <VocabBack_DESC desc={vocab.description} />
          <View
            style={{
              padding: 12,
            }}
          >
            {!SHOW_difficultyEdits ? (
              <MyVocabBack_BTNS
                {...{
                  vocab,
                  TOGGLE_vocab: TOGGLE_open,
                  HANDLE_vocabModal,
                  TOGGLE_difficultyEdits,
                }}
              />
            ) : (
              <MyVocabBackDifficultyEdit_BTNS
                active_DIFFICULTY={vocab.difficulty}
                privateVocabDifficultyEdit_PROPS={
                  privateVocabDifficultyEdit_PROPS
                }
                EDIT_difficulty={EDIT_vocabDifficulty}
                TOGGLE_open={TOGGLE_difficultyEdits}
              />
            )}
          </View>
        </>
      )}
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
  difficulty_3: {
    borderColor: MyColors.border_difficulty_3,
  },
  difficulty_2: {
    borderColor: MyColors.border_difficulty_2,
  },
  difficulty_1: {
    borderColor: MyColors.border_difficulty_1,
  },
  difficulty_0: {
    borderColor: MyColors.border_primary,
  },
  highlighted: {
    borderColor: MyColors.border_green,
    backgroundColor: MyColors.btn_green,
  },
});
