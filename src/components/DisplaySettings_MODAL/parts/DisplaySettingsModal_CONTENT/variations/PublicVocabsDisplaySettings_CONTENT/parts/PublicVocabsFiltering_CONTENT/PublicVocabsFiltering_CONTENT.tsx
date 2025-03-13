//
//
//

import { LanguagesBtn_BLOCK } from "@/src/components/LanguagesBtn_BLOCK/LanguagesBtn_BLOCK";
import { t } from "i18next";
import { DisplaySettingsModalContent_SCROLLVIEW } from "../../../../parts";
import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { z_USE_publicOneList } from "@/src/features_new/lists/hooks/zustand/z_USE_publicOneList/z_USE_publicOneList";

export function PublicVocabsFiltering_CONTENT() {
  const { z_publicOneList } = z_USE_publicOneList();
  const { filters, z_HANDLE_langFilter } = z_USE_publicVocabsDisplaySettings();

  const { langs = [] } = filters;

  return (
    <DisplaySettingsModalContent_SCROLLVIEW>
      <LanguagesBtn_BLOCK
        label={t("label.filterByLanguage")}
        allLang_IDs={z_publicOneList?.collected_lang_ids || []}
        activeLang_IDs={langs}
        HANDLE_lang={(lang_ID) => z_HANDLE_langFilter(lang_ID)}
      />
    </DisplaySettingsModalContent_SCROLLVIEW>
  );
}
