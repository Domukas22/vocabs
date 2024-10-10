//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle";
import { DisplaySettings_PROPS, Vocab_PROPS } from "@/src/db/props";
import Vocab_FRONT from "../Components/Vocab_FRONT/Vocab_FRONT";

import USE_updateVocabDifficulty from "../../../hooks/USE_updateVocabDifficulty";
import { VocabBack_TRS } from "../Components/VocabBack_TRS/VocabBack_TRS";
import VocabBack_DESC from "../Components/VocabBack_DESC/VocabBack_DESC";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import VocabBack_BTNS from "../Components/VocabBack_BTNS/VocabBack_BTNS";
import VocabBackDifficultyEdit_BTNS from "../Components/VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";
import { Translations_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";

interface VocabProps {
  trs: Translation_MODEL[];
  vocab: Vocab_MODEL;
  highlighted: boolean;

  HANDLE_updateModal: ({
    clear,
    vocab,
    trs,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
    trs?: Translation_MODEL[];
  }) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
function _MyVocab({ trs, vocab, highlighted, HANDLE_updateModal }: VocabProps) {
  const [open, TOGGLE_open] = USE_toggle();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits] = USE_toggle(false);

  const handleEdit = () => {
    HANDLE_updateModal({
      vocab,
      trs,
    });
  };

  const {
    UPDATE_privateVocabDifficulty,
    privateVocabDifficultyEdit_PROPS,
    updateDifficulty_ERROR,
  } = USE_updateVocabDifficulty();

  async function EDIT_vocabDifficulty(newDifficulty: 1 | 2 | 3) {
    if (
      !privateVocabDifficultyEdit_PROPS.loading &&
      vocab.difficulty !== newDifficulty
    ) {
      const result = await UPDATE_privateVocabDifficulty({
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
      open && vocab?.difficulty && s[`difficulty_${vocab?.difficulty}`],
      highlighted && s.highlighted,
    ],
    [open, vocab.difficulty, highlighted]
  );

  return (
    <View style={styles}>
      {!open && (
        <Vocab_FRONT
          trs={trs || []}
          difficulty={vocab?.difficulty}
          description={vocab?.description}
          highlighted={highlighted}
          TOGGLE_open={TOGGLE_open}
        />
      )}
      {open && (
        <>
          <VocabBack_TRS trs={trs} difficulty={vocab?.difficulty} />

          <VocabBack_DESC desc={vocab.description} />

          <View style={{ padding: 12 }}>
            {!SHOW_difficultyEdits ? (
              <VocabBack_BTNS
                {...{
                  vocab,
                  trs,
                  TOGGLE_vocab: TOGGLE_open,
                  TOGGLE_difficultyEdits,
                }}
                editBtn_FN={handleEdit}
              />
            ) : (
              <VocabBackDifficultyEdit_BTNS
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

const enhance = withObservables(
  ["vocab"],
  ({ vocab }: { vocab: Vocab_MODEL }) => ({
    trs: Translations_DB.query(Q.where("vocab_id", vocab.id)),
  })
);

export const MyVocab = enhance(_MyVocab);

const s = StyleSheet.create({
  vocab: {
    width: "100%",
    minWidth: "100%",
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
