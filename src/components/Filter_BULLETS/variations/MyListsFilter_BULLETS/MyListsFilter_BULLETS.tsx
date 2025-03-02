//
//
//

import { z_USE_myListsDisplaySettings } from "@/src/features_new/lists/hooks/zustand/displaySettings/z_USE_myListsDisplaySettings/z_USE_myListsDisplaySettings";
import {
  BulletDifficultyFilter_BTN,
  BulletLangFilter_BTN,
  BulletMarkedFilter_BTN,
} from "../../parts";

export function MyListsFilter_BULLETS() {
  const {
    filters,
    z_HANDLE_langFilter,
    z_HANDLE_difficultyFilter,
    z_HANDLE_markedFilter,
  } = z_USE_myListsDisplaySettings();

  const { langs = [], difficulties = [], byMarked = false } = filters;

  return (
    <>
      {langs.map((lang_id) => (
        <BulletLangFilter_BTN
          lang_id={lang_id}
          REMOVE_lang={() => z_HANDLE_langFilter(lang_id)}
          key={lang_id + "langFilter"}
        />
      ))}
      {difficulties.map((diff) => (
        <BulletDifficultyFilter_BTN
          difficulty={diff}
          REMOVE_difficulty={() => z_HANDLE_difficultyFilter(diff)}
          key={diff + "diffFilter"}
        />
      ))}
      {byMarked ? (
        <BulletMarkedFilter_BTN REMOVE_markedFilter={z_HANDLE_markedFilter} />
      ) : null}
    </>
  );
}
