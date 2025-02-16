//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";

import { Vocab_TYPE } from "@/src/features/vocabs/types";
import Vocab_FRONT from "../helpers/Vocab_FRONT/Vocab_FRONT";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "../../../../USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";
import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";
import VocabBack_BTNS from "../helpers/VocabBack_BTNS/VocabBack_BTNS";
import VocabBack_TEXT from "../helpers/VocabBack_TEXT/VocabBack_TEXT";
import { VocabBack_TRS } from "../helpers/VocabBack_TRS/VocabBack_TRS";

interface VocabProps {
  vocab: Vocab_TYPE;
  highlighted: boolean;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  IS_open: boolean;
  TOGGLE_open: (val?: boolean) => void;
  UPDATE_vocabDifficulty: (
    vocab_ID: string,
    current_DIFFICULTY: number,
    new_DIFFICULTY: 1 | 2 | 3,
    CLOSE_editBtns: () => void
  ) => Promise<void>;
  UPDATE_vocabMarked: (vocab_ID: string, val: boolean) => Promise<void>;
  SOFTDELETE_vocab: (vocab_ID: string) => Promise<void>;
  current_ACTIONS: currentVocabAction_TYPE[];
  OPEN_vocabSoftDeleteModal: (vocab: Vocab_TYPE) => void;
}

export const Vocab_CARD = React.memo(function Vocab_CARD({
  list_TYPE,
  fetch_TYPE,
  vocab,
  highlighted,
  IS_open,
  TOGGLE_open = () => {},
  OPEN_vocabSoftDeleteModal = (vocab: Vocab_TYPE) => {},
  UPDATE_vocabDifficulty = () => Promise.resolve(),
  UPDATE_vocabMarked = () => Promise.resolve(),
  SOFTDELETE_vocab = () => Promise.resolve(),
  current_ACTIONS = [],
}: VocabProps) {
  const trs = vocab?.trs || [];

  const [open, toggle, set] = USE_toggle(IS_open);

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
            OPEN_vocabUpdateModal={() => {}}
            UPDATE_vocabDifficulty={async (
              vocab_ID: string,
              current_DIFFICULTY: number,
              new_DIFFICULTY: 1 | 2 | 3,
              CLOSE_editBtns: () => void
            ) => {
              await UPDATE_vocabDifficulty(
                vocab_ID,
                current_DIFFICULTY,
                new_DIFFICULTY,
                CLOSE_editBtns
              );
            }}
            UPDATE_vocabMarked={UPDATE_vocabMarked}
            SOFTDELETE_vocab={SOFTDELETE_vocab}
            OPEN_vocabCopyModal={() => {}}
            OPEN_vocabPermaDeleteModal={() => {}}
            OPEN_vocabSoftDeleteModal={OPEN_vocabSoftDeleteModal}
            current_ACTIONS={current_ACTIONS}
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
