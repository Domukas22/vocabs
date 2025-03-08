//
//
//

import { USE_toggle } from "@/src/hooks";

export function USE_vocabCardStates() {
  const [SHOULD_showDifficultyEdits, TOGGLE_difficultyEdits] =
    USE_toggle(false);
  const [SHOULD_showDeleteConfirmation, TOGGLE_deleteConfirmation] =
    USE_toggle(false);

  return {
    SHOULD_showDifficultyEdits,
    SHOULD_showDeleteConfirmation,
    TOGGLE_difficultyEdits,
    TOGGLE_deleteConfirmation,
  };
}
