//
//

import { useMemo } from "react";

//
export default function USE_isSearching({
  IS_fetching = false,
  IS_debouncing = false,
  IS_loadingMore = false,
}: {
  IS_fetching: boolean;
  IS_debouncing: boolean;
  IS_loadingMore: boolean;
}) {
  return useMemo(
    () => (IS_fetching || IS_debouncing) && !IS_loadingMore,
    [IS_fetching, IS_debouncing, IS_loadingMore]
  );
}
