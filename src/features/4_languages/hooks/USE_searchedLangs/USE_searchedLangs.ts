//
//
//

import { useEffect, useState, useCallback } from "react";
import { Language_MODEL, Vocab_MODEL } from "@/src/db/models";

export function USE_searchedLangs(langs: Language_MODEL[] | undefined) {
  const [searched_LANGS, SET_searchedLangs] = useState<Language_MODEL[]>(langs);
  const [search, setSearch] = useState("");
  const [ARE_langsSearching, SET_areLangsSearching] = useState(false);

  // Function to handle searching
  const SEARCH_langs = useCallback((newSearch: string) => {
    setSearch(newSearch);
    SET_areLangsSearching(true); // Set fetching state to true
  }, []);

  useEffect(() => {
    const filter = async () => {
      // Use setTimeout to offload filtering to the event loop
      const filtered = await new Promise<Language_MODEL[]>((resolve) => {
        setTimeout(() => {
          const result = langs?.filter(
            (lang) =>
              lang.lang_in_en
                ?.toLowerCase()
                .includes(search.toLowerCase().trim()) ||
              lang.lang_in_de
                ?.toLowerCase()
                .includes(search.toLowerCase().trim()) ||
              lang.country_in_en
                ?.toLowerCase()
                .includes(search.toLowerCase().trim()) ||
              lang.country_in_de
                ?.toLowerCase()
                .includes(search.toLowerCase().trim())
          );
          resolve(result || []);
        }, 0); // No delay; just offloading to the event loop
      });
      SET_searchedLangs(filtered);
      SET_areLangsSearching(false); // Reset fetching state
    };

    filter(); // Call the async function
  }, [search, langs]); // Re-run when search or lists change

  return { searched_LANGS, search, SEARCH_langs, ARE_langsSearching };
}
