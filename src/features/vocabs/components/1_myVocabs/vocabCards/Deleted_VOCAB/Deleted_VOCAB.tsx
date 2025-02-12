//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useMemo, useState } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";
import Vocab_FRONT from "../Components/Vocab_FRONT/Vocab_FRONT";

import { VocabBack_TRS } from "../Components/VocabBack_TRS/VocabBack_TRS";
import VocabBottomText_WRAP from "../Components/VocabBottomText_WRAP/VocabBottomText_WRAP";
import List_MODEL from "@/src/db/models/List_MODEL";
import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { useTranslation } from "react-i18next";
import { useToast } from "react-native-toast-notifications";
import { Vocab_TYPE } from "@/src/features/vocabs/types";

interface VocabProps {
  vocab: Vocab_TYPE | undefined;
  SELECT_forRevival: (vocab: Vocab_TYPE) => void | undefined;
}

// TOGGLEvocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export function Deleted_VOCAB({
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
    [open, vocab?.difficulty]
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
          <VocabBottomText_WRAP desc={vocab?.description} />

          <View style={{ padding: 12, gap: 8 }}>
            <Btn
              type="simple_primary_text"
              onPress={() => {
                SELECT_forRevival(vocab);
              }}
              text={t("btn.reviveVocab")}
            />
            <Btn
              type="delete"
              onPress={async () => await vocab?.DELETE_vocab("permanent")}
              text={t("btn.deletePermanently")}
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
