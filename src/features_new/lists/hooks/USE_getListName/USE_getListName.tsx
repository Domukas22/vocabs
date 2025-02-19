//
//
//

import { t } from "i18next";
import { useMemo } from "react";
import { list_TYPES } from "../../types";
import { z_USE_myOneList } from "../z_USE_myOneList/z_USE_myOneList";

export function USE_getListName({ type = "private" }: { type: list_TYPES }) {
  const { z_myOneList, z_IS_myOneListFetching } = z_USE_myOneList();
  const list_NAME = useMemo(() => {
    if (type === "private") {
      if (z_IS_myOneListFetching) return t("header.fetchingOneList");
      if (z_myOneList?.name) return z_myOneList?.name;
      return t("header.noListFound");
    }
    return "🟡 Implement Public list name 🟡";
  }, [z_myOneList]);

  return { list_NAME };
}
