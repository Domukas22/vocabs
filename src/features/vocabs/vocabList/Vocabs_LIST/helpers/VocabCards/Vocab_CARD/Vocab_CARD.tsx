//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";
import { VocabTr_TYPE } from "@/src/features/vocabs/types";

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { useTranslation } from "react-i18next";
import { withObservables } from "@nozbe/watermelondb/react";
import { useToast } from "react-native-toast-notifications";
import { Vocab_TYPE } from "@/src/features/vocabs/types";
import Vocab_FRONT from "../helpers/Vocab_FRONT/Vocab_FRONT";
import { VocabBack_TRS } from "../helpers/VocabBack_TRS/VocabBack_TRS";
import VocabBack_TEXT from "../helpers/VocabBack_TEXT/VocabBack_TEXT";
import VocabBack_BTNS from "../helpers/VocabBack_BTNS/VocabBack_BTNS";
import VocabBackDifficultyEdit_BTNS from "../helpers/VocabBackDifficultyEdit_BTNS/VocabBackDifficultyEdit_BTNS";
import {
  vocabFetch_TYPES,
  vocabList_TYPES,
} from "../../../../USE_myVocabs/helpers/USE_fetchVocabs/helpers/FETCH_vocabs/types";

interface VocabProps {
  vocab: Vocab_TYPE;
  highlighted: boolean;
  list_TYPE: vocabList_TYPES;
  fetch_TYPE: vocabFetch_TYPES;
  IS_open: boolean;
  TOGGLE_open: (val?: boolean) => void;
}

// TOGGLE_vocabModal needs to also pass in th etranslations, so we dont have to pass them async and get a delayed manageVocabModal update
export function Vocab_CARD({
  list_TYPE,
  fetch_TYPE,
  vocab,
  highlighted,
  IS_open,
  TOGGLE_open,
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
            OPEN_vocabCopyModal={() => {}}
            OPEN_vocabPermaDeleteModal={() => {}}
          />
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
