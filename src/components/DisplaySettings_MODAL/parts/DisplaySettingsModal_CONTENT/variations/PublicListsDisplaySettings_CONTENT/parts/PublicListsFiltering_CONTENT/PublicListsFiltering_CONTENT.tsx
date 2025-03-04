//
//
//

import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_publicListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";
import { z_USE_publicLists } from "@/src/features_new/lists/hooks/zustand/z_USE_publicLists/z_USE_publicLists";
import { t } from "i18next";
import { DisplaySettingsModalContent_SCROLLVIEW } from "../../../../parts";

export function PublicListsFiltering_CONTENT() {
  const { z_publicListsCollectedLangIds } = z_USE_publicLists();
  const { filters, z_HANDLE_langFilter } = z_USE_publicListsDisplaySettings();

  const { langs = [] } = filters;

  return (
    <DisplaySettingsModalContent_SCROLLVIEW>
      <LanguagesBtn_BLOCK
        label={t("label.filterByLanguage")}
        allLang_IDs={z_publicListsCollectedLangIds}
        activeLang_IDs={langs}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
      />
    </DisplaySettingsModalContent_SCROLLVIEW>
  );
}
