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
    new_DIFFICULTY: 1 | 2 | 3
  ) => Promise<void>;
  UPDATE_vocabMarked: (vocab_ID: string, val: boolean) => Promise<void>;
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
  current_ACTIONS = [],
}: VocabProps) {
  const trs = vocab?.trs || [];

  // ------------------------------------------------
  // If we rely on only 'IS_open', there will be
  // a slight delay after toggling the open state.

  // So we have a local open state, which works instantly
  // On mount, it will have the internal IS_open value
  // from the Set provided as an argument.

  // This way when we edit the vocab list array
  // by f.e. re-sorting or re-filtering,
  // the "open" state of each individual vocab will persist.
  const [open, _toggle, _set] = USE_toggle(IS_open);
  const toggle = useCallback(() => {
    if (open) {
      _set(false);
      TOGGLE_open(false);
    } else {
      _set(true);
      TOGGLE_open(true);
    }
  }, [open]);

  useEffect(() => {
    if (IS_open !== open) {
      _set(IS_open);
    }
  }, [IS_open]);
  // ------------------------------------------------

  const styles = useMemo(
    () => [
      s._vocab,
      IS_open && s.vocab_open,
      IS_open && s[`difficulty_${vocab?.difficulty || 0}`],
      highlighted && s.highlighted,
    ],
    [IS_open, vocab?.difficulty, highlighted]
  );

  return (
    <View style={styles}>
      {!IS_open && (
        <Vocab_FRONT
          trs={trs || []}
          difficulty={vocab?.difficulty || 0}
          description={vocab?.description}
          highlighted={highlighted}
          TOGGLE_open={toggle}
          IS_marked={vocab?.is_marked}
        />
      )}
      {IS_open && (
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
            UPDATE_vocabDifficulty={UPDATE_vocabDifficulty}
            UPDATE_vocabMarked={UPDATE_vocabMarked}
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
