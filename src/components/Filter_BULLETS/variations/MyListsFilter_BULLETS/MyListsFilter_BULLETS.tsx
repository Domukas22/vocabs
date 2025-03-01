//
//
//

import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import { BulletLangFilter_BTN } from "../../parts";

export function MyListsFilter_BULLETS() {
  const { z_myListDisplay_SETTINGS, z_HANDLE_langFilter } =
    z_USE_myListsDisplaySettings();

  const { langFilters = [] } = z_myListDisplay_SETTINGS;

  return (
    <>
      {langFilters.map((lang_id) => (
        <BulletLangFilter_BTN
          lang_id={lang_id}
          REMOVE_lang={() => z_HANDLE_langFilter(lang_id)}
          key={lang_id + "langFilter"}
        />
      ))}
    </>
  );
}
