//
//
//

import { useCallback, useState } from "react";
import { Vocab_TYPE } from "../../types";

type SetTargetVocab_ACTION = "update" | "move" | "copy" | "delete" | "revive";

export function USE_targetVocabs() {
  const [toUpdate_VOCAB, SET_toUpdateVocab] = useState<
    Vocab_TYPE | undefined
  >();
  const [toDelete_VOCAB, SET_toDeleteVocab] = useState<
    Vocab_TYPE | undefined
  >();
  const [toCopy_VOCAB, SET_toCopyVocab] = useState<Vocab_TYPE | undefined>();
  const [toMove_VOCAB, SET_toMoveVocab] = useState<Vocab_TYPE | undefined>();
  const [toRevive_VOCAB, SET_toReviveVocab] = useState<
    Vocab_TYPE | undefined
  >();

  const SET_targetVocab = useCallback(
    (vocab: Vocab_TYPE, as: SetTargetVocab_ACTION) => {
      if (!vocab || !as) return;

      switch (as) {
        case "update":
          SET_toUpdateVocab(vocab);
          break;
        case "delete":
          SET_toDeleteVocab(vocab);
          break;
        case "copy":
          SET_toCopyVocab(vocab);
          break;
        case "move":
          SET_toMoveVocab(vocab);
          break;
        case "revive":
          SET_toReviveVocab(vocab);
          break;
      }
    },
    []
  );

  const RESET_targetVocabs = useCallback(() => {
    SET_toUpdateVocab(undefined);
    SET_toDeleteVocab(undefined);
    SET_toCopyVocab(undefined);
    SET_toMoveVocab(undefined);
    SET_toReviveVocab(undefined);
  }, []);

  return {
    toUpdate_VOCAB,
    toDelete_VOCAB,
    toCopy_VOCAB,
    toMove_VOCAB,
    toRevive_VOCAB,
    SET_targetVocab,
    RESET_targetVocabs,
  };
}
