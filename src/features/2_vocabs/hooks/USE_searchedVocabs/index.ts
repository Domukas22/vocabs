//
//
//

import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import React, { useEffect, useState, useCallback } from "react";
export default function USE_searchedVocabs({
  vocabs,
  search,
}: {
  vocabs: Vocab_MODEL[];
  search: string;
}) {
  const [searched_VOCABS, SET_searchedVocabs] = useState<Vocab_MODEL[]>(vocabs);
  const [ARE_vocabsSearching, SET_areVocabsSearching] = useState(false);

  useEffect(() => {
    const filter = async () => {
      SET_areVocabsSearching(true);
      // Use setTimeout to offload filtering to the event loop
      const filtered = await new Promise<Vocab_MODEL[]>((resolve) => {
        setTimeout(() => {
          const result = vocabs.filter(
            (vocab) =>
              vocab.description
                ?.toLowerCase()
                .includes(search.toLowerCase().trim()) ||
              vocab.translations?.some((tr) =>
                tr.text.toLowerCase().includes(search.toLowerCase().trim())
              )
          );
          resolve(result);
        }, 0); // No delay; just offloading to the event loop
      });
      SET_searchedVocabs(filtered);
      SET_areVocabsSearching(false); // Reset fetching state
    };

    filter(); // Call the async function
  }, [search, vocabs]); // Re-run when search or lists change

  return { searched_VOCABS, ARE_vocabsSearching };
}
