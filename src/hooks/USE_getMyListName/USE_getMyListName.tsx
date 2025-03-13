//
//
//

import { z_USE_myVocabs } from "@/src/features_new/vocabs/hooks/zustand/z_USE_myVocabs/z_USE_myVocabs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function USE_getMyListName() {
  const { z_myList: list, z_loading_STATE: loading_STATE } = z_USE_myVocabs();

  const { t } = useTranslation();

  const list_NAME = useMemo(() => {
    if (!list?.id) {
      if (
        loading_STATE === "loading" ||
        loading_STATE === "filtering" ||
        loading_STATE === "searching" ||
        loading_STATE === "searching_and_filtering"
      ) {
        return "Loading list...";
      }

      return "NO LIST FOUND";
    }
    if (list.id === "all-public-vocabs") return t("listName.allPublicVocabs");
    if (list.id === "all-my-vocabs") return t("listName.allMyVocabs");
    if (list.id === "all-my-marked-vocabs") return t("listName.savedVocabs");
    if (list.id === "all-my-deleted-vocabs") return t("listName.deletedVocabs");

    if (list.name) return list.name;

    return "NO LIST FOUND";
  }, [list, loading_STATE]);

  return { list_NAME };
}
