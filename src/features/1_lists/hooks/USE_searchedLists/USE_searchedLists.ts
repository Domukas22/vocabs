//
//
//

import { useEffect, useState, useCallback } from "react";
import { List_PROPS } from "@/src/db/props";

export function USE_searchedLists(lists: List_PROPS[]) {
  const [searched_LISTS, setSearched_LISTS] = useState<List_PROPS[]>(lists);
  const [search, setSearch] = useState("");
  const [ARE_listsSearching, setARE_listsSearching] = useState(false);

  // Function to handle searching
  const SEARCH_lists = useCallback((newSearch: string) => {
    setSearch(newSearch);
    setARE_listsSearching(true); // Set fetching state to true
  }, []);

  useEffect(() => {
    const filterListsAsync = async () => {
      // Use setTimeout to offload filtering to the event loop
      const filtered = await new Promise<List_PROPS[]>((resolve) => {
        setTimeout(() => {
          const result = lists.filter((list) =>
            list.name.toLowerCase().includes(search.toLowerCase().trim())
          );
          resolve(result);
        }, 0); // No delay; just offloading to the event loop
      });
      setSearched_LISTS(filtered);
      setARE_listsSearching(false); // Reset fetching state
    };

    filterListsAsync(); // Call the async function
  }, [search, lists]); // Re-run when search or lists change

  return { searched_LISTS, search, SEARCH_lists, ARE_listsSearching };
}
