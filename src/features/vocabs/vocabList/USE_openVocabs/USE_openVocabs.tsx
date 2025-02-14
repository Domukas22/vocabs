//
//
//

import { useCallback, useState } from "react";

export function USE_openVocabs() {
  const [openVocab_IDs, SET_openVocabIds] = useState<Set<string>>(new Set());

  const TOGGLE_vocab = useCallback((vocab_ID: string, val?: boolean) => {
    SET_openVocabIds((prev) => {
      const newSet = new Set(prev);

      if (typeof val === "boolean") {
        val ? newSet.add(vocab_ID) : newSet.delete(vocab_ID);
        return newSet;
      }

      newSet.has(vocab_ID) ? newSet.delete(vocab_ID) : newSet.add(vocab_ID);
      return newSet;
    });
  }, []);

  return { openVocab_IDs, TOGGLE_vocab };
}
