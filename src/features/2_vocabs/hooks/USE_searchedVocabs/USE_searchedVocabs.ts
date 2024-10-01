//
//
//

import { useEffect, useState, useCallback } from "react";
import { Vocab_MODEL } from "@/src/db/models";

export function USE_searchedVocabs(vocabs: Vocab_MODEL[]) {
  const [searched_VOCABS, SET_searchedVocabs] = useState<Vocab_MODEL[]>(vocabs);
  const [search, setSearch] = useState("");
  const [ARE_vocabsSearching, SET_areVocabsSearching] = useState(false);

  // Function to handle searching
  const SEARCH_vocabs = useCallback((newSearch: string) => {
    setSearch(newSearch);
    SET_areVocabsSearching(true); // Set fetching state to true
  }, []);

  useEffect(() => {
    const filter = async () => {
      // Use setTimeout to offload filtering to the event loop
      const filtered = await new Promise<Vocab_MODEL[]>((resolve) => {
        setTimeout(() => {
          const result = vocabs.filter(
            (vocab) =>
              vocab.description?.toLowerCase().includes(search.toLowerCase()) ||
              vocab.translations?.some((tr) =>
                tr.text.toLowerCase().includes(search.toLowerCase())
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

  return { searched_VOCABS, search, SEARCH_vocabs, ARE_vocabsSearching };
}
