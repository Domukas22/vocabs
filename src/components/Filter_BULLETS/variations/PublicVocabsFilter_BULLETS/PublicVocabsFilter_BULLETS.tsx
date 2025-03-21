//
//
//

import { z_USE_publicVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_publicVocabsDisplaySettings/z_USE_publicVocabsDisplaySettings";
import { BulletLangFilter_BTN } from "../../parts";

export function PublicVocabsFilter_BULLETS() {
  const { filters, z_HANDLE_langFilter } = z_USE_publicVocabsDisplaySettings();

  const { langs = [] } = filters;

  return (
    <>
      {langs.map((lang_id) => (
        <BulletLangFilter_BTN
          key={lang_id}
          lang_id={lang_id}
          REMOVE_lang={() => z_HANDLE_langFilter(lang_id)}
        />
      ))}
    </>
  );
}
