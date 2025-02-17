//
//
//

import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";

export function IS_vocabDifficultyBeingUpdated(
  vocab_ID: string,
  z_myVocabsCurrent_ACTIONS: currentVocabAction_TYPE[] = []
) {
  return z_myVocabsCurrent_ACTIONS.some(
    (action) =>
      action.vocab_ID === vocab_ID && action.action === "updating_difficulty"
  );
}
