//
//
//

import { currentVocabAction_TYPE } from "@/src/app/(main)/vocabs/[list_id]";

export function IS_vocabDifficultyBeingUpdated(
  vocab_ID: string,
  currentVocab_ACTIONS: currentVocabAction_TYPE[] = []
) {
  return currentVocab_ACTIONS.some(
    (action) =>
      action.vocab_ID === vocab_ID && action.action === "updating_difficulty"
  );
}
