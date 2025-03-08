//
//
//

import { delete_TYPE } from "@/src/types/general_TYPES";
import { memo, useMemo } from "react";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";
import { DeleteAndCloseBtn_WRAP } from "../DeleteAndCloseBtn_WRAP/DeleteAndCloseBtn_WRAP";
import { FinalDeleteBtn_WRAP } from "../FinalDeleteBtn_WRAP/FinalDeleteBtn_WRAP";
import { z_USE_currentActions } from "@/src/hooks/zustand/z_USE_currentActions/z_USE_currentActions";

type Props = {
  vocab: Vocab_TYPE;

  SHOW_deleteConfirmation: boolean;
  delete_TYPE: delete_TYPE;
  TOGGLE_deleteConfirmation: () => void;
  TOGGLE_vocabCard: () => void;
};

export const CloseBtn_WRAP = memo(
  ({
    vocab,

    delete_TYPE = "soft",
    SHOW_deleteConfirmation = false,
    TOGGLE_deleteConfirmation = () => {},
    TOGGLE_vocabCard = () => {},
  }: Props) => {
    const { z_currentActions, IS_inAction } = z_USE_currentActions();

    const IS_deleting = useMemo(
      () => IS_inAction("vocab", vocab?.id, "deleting"),
      [z_currentActions]
    );

    return SHOW_deleteConfirmation ? (
      <FinalDeleteBtn_WRAP
        IS_deleting={IS_deleting}
        TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
        delete_TYPE={delete_TYPE}
        vocab={vocab}
      />
    ) : (
      <DeleteAndCloseBtn_WRAP
        TOGGLE_deleteConfirmation={TOGGLE_deleteConfirmation}
        TOGGLE_vocabCard={TOGGLE_vocabCard}
      />
    );
  }
);
