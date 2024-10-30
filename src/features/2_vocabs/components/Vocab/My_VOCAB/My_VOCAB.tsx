//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle";
import { tr_PROPS } from "@/src/db/props";
import Vocab_FRONT from "../Components/Vocab_FRONT/Vocab_FRONT";

import USE_updateVocabDifficulty from "../../../hooks/USE_updateVocabDifficulty";
import { VocabBack_TRS } from "../Components/VocabBack_TRS/VocabBack_TRS";
import VocabBottomText_WRAP from "../Components/VocabBottomText_WRAP/VocabBottomText_WRAP";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import VocabBack_BTNS from "../Components/VocabBack_BTNS/VocabBack_BTNS";
import VocabBackDifficultyEdit_BTNS from "../Components/VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";

import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import Btn from "@/src/components/Btn/Btn";
import { useTranslation } from "react-i18next";
import USE_updateVocabIsMarked from "../../../hooks/USE_updateVocabIsMarked";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { withObservables } from "@nozbe/watermelondb/react";

interface VocabProps {
  _vocab: Vocab_MODEL;
  highlighted: boolean;

  HANDLE_updateModal: ({
    clear,
    vocab,
    trs,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
    trs?: tr_PROPS[];
  }) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
function _MyVocab({ _vocab, highlighted, HANDLE_updateModal }: VocabProps) {
  const [open, TOGGLE_open] = USE_toggle();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits, SET_difficultyEdit] =
    USE_toggle(false);

  const trs = _vocab?.trs || [];

  const handleEdit = () => {
    HANDLE_updateModal({
      vocab: _vocab,
    });
  };

  const styles = useMemo(
    () => [
      s._vocab,
      open && s.vocab_open,
      open && _vocab?.difficulty && s[`difficulty_${_vocab?.difficulty}`],
      highlighted && s.highlighted,
    ],
    [open, _vocab.difficulty, highlighted]
  );
  const { t } = useTranslation();

  return (
    <View style={styles}>
      {/* <Styled_TEXT>{_vocab?.is_marked ? "MARKED" : "not marked"}</Styled_TEXT> */}
      {!open && (
        <Vocab_FRONT
          trs={trs || []}
          difficulty={_vocab?.difficulty}
          description={_vocab?.description}
          highlighted={highlighted}
          TOGGLE_open={TOGGLE_open}
          IS_marked={_vocab?.is_marked}
        />
      )}
      {open && (
        <>
          <VocabBack_TRS trs={trs} difficulty={_vocab?.difficulty} />
          <VocabBottomText_WRAP desc={_vocab.description} />

          <View style={{ padding: 12, gap: 8 }}>
            {!SHOW_difficultyEdits ? (
              <VocabBack_BTNS
                {...{
                  vocab: _vocab,
                  trs,

                  TOGGLE_difficultyEdits,
                }}
                editBtn_FN={handleEdit}
              />
            ) : (
              <VocabBackDifficultyEdit_BTNS
                active_DIFFICULTY={_vocab.difficulty}
                UPDATE_difficulty={(diff: 1 | 2 | 3) => {
                  (async () => {
                    await _vocab.EDIT_difficulty(diff);
                    TOGGLE_difficultyEdits();
                  })();
                }}
                TOGGLE_open={TOGGLE_difficultyEdits}
              />
            )}
            <Btn
              type="simple"
              onPress={() => {
                TOGGLE_open();
                SET_difficultyEdit(false);
              }}
              text={t("btn.close")}
            />
          </View>
        </>
      )}
    </View>
  );
}

const enhance = withObservables(["vocab"], ({ vocab }) => ({
  _vocab: vocab.observe(),
}));
const MyVocab = enhance(_MyVocab);
export default MyVocab;

const s = StyleSheet.create({
  _vocab: {
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
