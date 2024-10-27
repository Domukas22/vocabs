import { useState, useEffect } from "react";

export default function USE_debounceSearch() {
  // put "search" in the searchbar, and "debouncedSearch" in the filters
  const [search, SET_search] = useState("");
  const [debouncedSearch, SET_debouncedSearch] = useState("");

  useEffect(() => {
    // if empty, fetch instantly
    if (search === "") {
      SET_debouncedSearch(search);
      return;
    }
    const handler = setTimeout(() => {
      SET_debouncedSearch(search);
    }, 500); // Adjust the debounce delay (in milliseconds) as needed

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  return { search, debouncedSearch, SET_search };
}
