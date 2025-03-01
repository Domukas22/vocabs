//
//
//

import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_publicListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";
import { z_USE_publicLists } from "@/src/features_new/lists/hooks/zustand/z_USE_publicLists/z_USE_publicLists";
import { t } from "i18next";

export function PublicListsFiltering_CONTENT() {
  const { z_publicListsCollectedLangIds } = z_USE_publicLists();
  const { z_publicListDisplay_SETTINGS, z_HANDLE_langFilter } =
    z_USE_publicListsDisplaySettings();

  return (
    <>
      <LanguagesBtn_BLOCK
        label={t("label.filterByLanguage")}
        allLang_IDs={z_publicListsCollectedLangIds}
        activeLang_IDs={z_publicListDisplay_SETTINGS?.langFilters}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
      />
    </>
  );
}
