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

import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import Btn from "@/src/components/Btn/Btn";
import { useTranslation } from "react-i18next";
import USE_updateVocabIsMarked from "../../../hooks/USE_updateVocabIsMarked";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { withObservables } from "@nozbe/watermelondb/react";
import { useToast } from "react-native-toast-notifications";

interface VocabProps {
  vocab: Vocab_MODEL;
  SELECT_forRevival: (vocab: Vocab_MODEL) => void;
}

// TOGGLEvocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export default function Deletedvocab({
  vocab,
  SELECT_forRevival = () => {},
}: VocabProps) {
  const [open, TOGGLE_open] = USE_toggle();

  const trs = vocab?.trs || [];

  const styles = useMemo(
    () => [
      s.vocab,
      open && s.vocab_open,
      open && vocab?.difficulty && s[`difficulty_${vocab?.difficulty}`],
    ],
    [open, vocab.difficulty]
  );
  const { t } = useTranslation();
  const toast = useToast();

  const [target_LIST, SET_targetList] = useState<List_MODEL | undefined>();

  return (
    <View style={styles}>
      {/* <Styled_TEXT>{vocab?.is_marked ? "MARKED" : "not marked"}</Styled_TEXT> */}
      {!open && (
        <Vocab_FRONT
          trs={trs || []}
          difficulty={vocab?.difficulty}
          description={vocab?.description}
          TOGGLE_open={TOGGLE_open}
          IS_marked={vocab?.is_marked}
        />
      )}
      {open && (
        <>
          <VocabBack_TRS trs={trs} difficulty={vocab?.difficulty} />
          <VocabBottomText_WRAP desc={vocab.description} />

          <View style={{ padding: 12, gap: 8 }}>
            <Btn
              type="simple_primary_text"
              onPress={() => {
                SELECT_forRevival(vocab);
              }}
              text={t("btn.reviveVocab")}
            />
            <Btn type="simple" onPress={TOGGLE_open} text={t("btn.close")} />
          </View>
        </>
      )}
    </View>
  );
}

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