//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";
import { VocabTr_TYPE } from "@/src/features/vocabs/types";

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { useTranslation } from "react-i18next";
import { withObservables } from "@nozbe/watermelondb/react";
import { useToast } from "react-native-toast-notifications";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import Vocab_FRONT from "../helpers/Vocab_FRONT/Vocab_FRONT";
import { VocabBack_TRS } from "../helpers/VocabBack_TRS/VocabBack_TRS";
import VocabBottomText_WRAP from "../helpers/VocabBottomText_WRAP/VocabBottomText_WRAP";
import VocabBack_BTNS from "../helpers/VocabBack_BTNS/VocabBack_BTNS";
import VocabBackDifficultyEdit_BTNS from "../helpers/VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";

interface VocabProps {
  vocab: Vocab_TYPE;
  highlighted: boolean;

  HANDLE_updateModal: ({
    clear,
    vocab,
    trs,
  }: {
    clear?: boolean;
    vocab?: Vocab_TYPE;
    trs?: VocabTr_TYPE[];
  }) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export default function MyVocab_CARD({
  vocab,
  highlighted,
  HANDLE_updateModal,
}: VocabProps) {
  const [open, TOGGLE_open] = USE_toggle();
  const [SHOW_difficultyEdits, TOGGLE_difficultyEdits, SET_difficultyEdit] =
    USE_toggle(false);

  const trs = vocab?.trs || [];

  const handleEdit = () => {
    HANDLE_updateModal({
      vocab: vocab,
    });
  };

  const styles = useMemo(
    () => [
      s._vocab,
      open && s.vocab_open,
      open && vocab?.difficulty && s[`difficulty_${vocab?.difficulty}`],
      highlighted && s.highlighted,
    ],
    [open, vocab?.difficulty, highlighted]
  );
  const { t } = useTranslation();
  const toast = useToast();

  return (
    <View style={styles}>
      {/* <Styled_TEXT>{`${_vocab?.created_at}`}</Styled_TEXT> */}

      {!open && (
        <Vocab_FRONT
          trs={trs || []}
          difficulty={vocab?.difficulty}
          description={vocab?.description}
          highlighted={highlighted}
          TOGGLE_open={TOGGLE_open}
          IS_marked={vocab?.is_marked}
        />
      )}
      {open && (
        <>
          <VocabBack_TRS trs={trs} difficulty={vocab?.difficulty} />
          <VocabBottomText_WRAP desc={vocab?.description} />

          <View style={{ padding: 12, gap: 8 }}>
            {!SHOW_difficultyEdits ? (
              <VocabBack_BTNS
                {...{
                  vocab: vocab,
                  trs,

                  TOGGLE_difficultyEdits,
                }}
                editBtn_FN={handleEdit}
              />
            ) : (
              <VocabBackDifficultyEdit_BTNS
                active_DIFFICULTY={vocab?.difficulty}
                UPDATE_difficulty={(diff: 1 | 2 | 3) => {
                  (async () => {
                    await vocab?.EDIT_difficulty(diff);
                    TOGGLE_difficultyEdits();
                    toast.show(t("notifications.difficultyUpdated"), {
                      type: "success",
                      duration: 2000,
                    });
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
