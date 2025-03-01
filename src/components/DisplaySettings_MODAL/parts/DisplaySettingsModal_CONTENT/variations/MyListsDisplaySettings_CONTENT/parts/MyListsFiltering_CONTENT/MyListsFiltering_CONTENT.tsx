//
//
//

import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { z_USE_myLists } from "@/src/features_new/lists/hooks/zustand/z_USE_myLists/z_USE_myLists";
import { t } from "i18next";

export function MyListsFiltering_CONTENT() {
  const { z_myListsCollectedLangIds } = z_USE_myLists();
  const { z_myListDisplay_SETTINGS, z_HANDLE_langFilter } =
    z_USE_myListsDisplaySettings();

  return (
    <>
      <LanguagesBtn_BLOCK
        allLang_IDs={z_myListsCollectedLangIds}
        activeLang_IDs={z_myListDisplay_SETTINGS?.langFilters}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
        label={t("label.filterByLanguage")}
      />
    </>
  );
}
