//
//
//

//
//
//

import { z_USE_langs } from "@/src/features_new/languages/hooks/zustand/z_USE_langs/z_USE_langs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Lang_TYPE } from "../../types";

export function USE_searchedLangs({ search = "" }: { search: string }) {
  const { z_SEARCH_langs, z_langs } = z_USE_langs();

  const [searched_LANGS, SET_langs] = useState<Lang_TYPE[]>(
    Object.values(z_langs) || []
  );

  const SEARCH_langs = useCallback(
    (search_VAL: string = "") => {
      SET_langs(
        !search_VAL
          ? Object.values(z_langs) || []
          : z_SEARCH_langs(search_VAL) || []
      );
    },
    [z_SEARCH_langs, searched_LANGS]
  );

  // refetch on search change
  useEffect(() => SEARCH_langs(search), [search]);

  return { searched_LANGS };
}
