//
//
//

import { z_USE_publicListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_publicListsDisplaySettings/z_USE_publicListsDisplaySettings";
import { BulletLangFilter_BTN } from "../../parts";

export function PublicListsFilter_BULLETS() {
  const { filters, z_HANDLE_langFilter } = z_USE_publicListsDisplaySettings();

  const { langs = [] } = filters;

  return (
    <>
      {langs.map((lang_id) => (
        <BulletLangFilter_BTN
          lang_id={lang_id}
          REMOVE_lang={() => z_HANDLE_langFilter(lang_id)}
          key={lang_id + "langFilter"}
        />
      ))}
    </>
  );
}
