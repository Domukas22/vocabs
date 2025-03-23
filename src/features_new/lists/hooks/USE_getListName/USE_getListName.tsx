//
//
//

import { t } from "i18next";
import { useMemo } from "react";

import { z_USE_myOneList } from "../zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_publicOneList } from "../zustand/z_USE_publicOneList/z_USE_publicOneList";
import { privateOrPublic_TYPE } from "@/src/types/general_TYPES";

export function USE_getListName({
  type = "private",
}: {
  type: privateOrPublic_TYPE;
}) {
  const { z_myOneList, z_IS_myOneListFetching } = z_USE_myOneList();
  const { z_publicOneList, z_IS_publicOneListFetching } = z_USE_publicOneList();

  const list_NAME = useMemo(() => {
    if (type === "private") {
      if (z_IS_myOneListFetching) return t("header.fetchingOneList");
      if (z_myOneList?.name) return z_myOneList?.name;
    }

    if (type === "public") {
      if (z_IS_publicOneListFetching) return t("header.fetchingOneList");
      if (z_publicOneList?.name) return z_publicOneList?.name;
    }

    return t("header.noListFound") || "No list found";
  }, [
    type,
    z_IS_myOneListFetching,
    z_myOneList,
    z_IS_publicOneListFetching,
    z_publicOneList,
  ]);

  return { list_NAME };
}
