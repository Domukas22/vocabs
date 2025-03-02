//
//
//

import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { z_USE_myOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_myOneList/z_USE_myOneList";
import { z_USE_publicLists } from "@/src/features_new/lists/hooks/zustand/z_USE_publicLists/z_USE_publicLists";
import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { t } from "i18next";

export function MyVocabsFiltering_CONTENT() {
  const { z_myOneList } = z_USE_myOneList();
  const { z_myVocabDisplay_SETTINGS, z_HANDLE_langFilter } =
    z_USE_myVocabsDisplaySettings();

  return (
    <>
      <LanguagesBtn_BLOCK
        label={t("label.filterByLanguage")}
        allLang_IDs={z_myOneList?.collected_lang_ids || []}
        activeLang_IDs={z_myVocabDisplay_SETTINGS?.langFilters}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
      />
    </>
  );
}
