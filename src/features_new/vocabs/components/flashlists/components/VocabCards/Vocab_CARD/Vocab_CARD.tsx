//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useMemo } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";

import Vocab_FRONT from "../helpers/Vocab_FRONT/Vocab_FRONT";
import { myVocabFetch_TYPES } from "../../../../../hooks/USE_fetchVocabs/FETCH_vocabs/types";
import VocabBack_BTNS from "../helpers/VocabBack_BTNS/VocabBack_BTNS";
import VocabBack_TEXT from "../helpers/VocabBack_TEXT/VocabBack_TEXT";
import { VocabBack_TRS } from "../helpers/VocabBack_TRS/VocabBack_TRS";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { list_TYPES } from "@/src/features_new/lists/types";

interface VocabProps {
  vocab: Vocab_TYPE;
  highlighted?: boolean;
  list_TYPE: list_TYPES;
  fetch_TYPE: myVocabFetch_TYPES;

  OPEN_updateVocabModal?: () => void;
  OPEN_vocabCopyModal?: () => void;
}

export const Vocab_CARD = React.memo(function Vocab_CARD({
  list_TYPE,
  fetch_TYPE,
  vocab,
  highlighted = false,

  OPEN_updateVocabModal = () => {},
  OPEN_vocabCopyModal = () => {},
}: VocabProps) {
  const trs = vocab?.trs || [];

  const [open, toggle, set] = USE_toggle();

  const styles = useMemo(
    () => [
      s._vocab,
      open && s.vocab_open,
      open && s[`difficulty_${vocab?.difficulty || 0}`],
      highlighted && s.highlighted,
    ],
    [open, vocab?.difficulty, highlighted]
  );

  return (
    <View style={styles}>
      {!open && (
        <Vocab_FRONT
          trs={trs || []}
          difficulty={vocab?.difficulty || 0}
          description={vocab?.description}
          highlighted={highlighted}
          TOGGLE_open={toggle}
          IS_marked={vocab?.is_marked}
        />
      )}

      {open && (
        <>
          <VocabBack_TRS trs={trs} difficulty={vocab?.difficulty || 0} />
          <VocabBack_TEXT
            desc={vocab?.description}
            list_NAME={
              list_TYPE === "public" ||
              (list_TYPE === "private" &&
                (fetch_TYPE === "all" || fetch_TYPE === "marked"))
                ? vocab?.list?.name || "Not in any list"
                : undefined
            }
          />

          <VocabBack_BTNS
            {...{ vocab, trs, list_TYPE, fetch_TYPE, TOGGLE_open: toggle }}
            OPEN_updateVocabModal={OPEN_updateVocabModal}
            OPEN_vocabCopyModal={OPEN_vocabCopyModal}
          />
        </>
      )}
    </View>
  );
});

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
