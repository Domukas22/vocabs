//
//
//

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { z_USE_oneList } from "../z_USE_oneList/z_USE_oneList";

export function USE_getListName() {
  const { list } = z_USE_oneList();
  const { t } = useTranslation();

  console.log(list?.id);
  const list_NAME = useMemo(() => {
    if (!list?.id) return "NO LIST FOUND";
    if (list.id === "all-public-vocabs") return t("listName.allPublicVocabs");
    if (list.id === "all-my-vocabs") return t("listName.allMyVocabs");
    if (list.id === "all-my-marked-vocabs") return t("listName.savedVocabs");
    if (list.id === "all-my-deleted-vocabs") return t("listName.deletedVocabs");

    if (list.name) return list.name;

    return "NO LIST FOUND";
  }, [list]);

  return { list_NAME };
}
