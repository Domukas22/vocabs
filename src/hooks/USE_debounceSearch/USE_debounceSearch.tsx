//
//
//

import { useState, useEffect } from "react";

export function USE_debounceSearch() {
  // put "search" in the searchbar, and "debouncedSearch" in the filters
  const [search, SET_search] = useState("");
  const [debouncedSearch, SET_debouncedSearch] = useState("");
  const [IS_debouncing, SET_isDebouncing] = useState(false);

  useEffect(() => {
    // if empty, fetch instantly
    if (search === "") {
      SET_debouncedSearch(search);
      SET_isDebouncing(false);
      return;
    }
    SET_isDebouncing(true);
    const handler = setTimeout(() => {
      SET_debouncedSearch(search);
      SET_isDebouncing(false);
    }, 150);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  // Update to handle non-string and invalid values gracefully
  const SET_safeSearch = (value: any) => {
    // If the value is invalid (null, undefined, or non-string), set to empty string
    SET_search(value && typeof value === "string" ? value : "");
  };

  return { search, debouncedSearch, IS_debouncing, SET_search: SET_safeSearch };
}
