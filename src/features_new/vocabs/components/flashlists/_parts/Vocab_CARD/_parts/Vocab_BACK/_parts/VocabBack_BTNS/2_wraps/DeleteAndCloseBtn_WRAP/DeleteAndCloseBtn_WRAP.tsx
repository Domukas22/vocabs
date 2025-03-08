//
//
//

import { memo } from "react";
import { InlineBtn_WRAP, DeleteIcon_BTN, Close_BTN } from "../../1_parts";

type Props = {
  TOGGLE_deleteConfirmation: () => void;
  TOGGLE_vocabCard: () => void;
};

export const DeleteAndCloseBtn_WRAP = memo(
  ({
    TOGGLE_deleteConfirmation = () => {},
    TOGGLE_vocabCard = () => {},
  }: Props) => {
    return (
      <InlineBtn_WRAP>
        <DeleteIcon_BTN onPress={TOGGLE_deleteConfirmation} />
        <Close_BTN onPress={TOGGLE_vocabCard} />
      </InlineBtn_WRAP>
    );
  }
);
