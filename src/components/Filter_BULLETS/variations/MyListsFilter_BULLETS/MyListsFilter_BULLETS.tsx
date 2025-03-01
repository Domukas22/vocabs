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
    z_myListDisplay_SETTINGS,
    z_HANDLE_langFilter,
    z_HANDLE_difficultyFilter,
    z_TOGGLE_filterByMarked,
  } = z_USE_myListsDisplaySettings();

  const {
    langFilters = [],
    SHOULD_filterByMarked = false,
    difficulty_FILTERS = [],
  } = z_myListDisplay_SETTINGS;

  return (
    <>
      {langFilters.map((lang_id) => (
        <BulletLangFilter_BTN
          lang_id={lang_id}
          REMOVE_lang={() => z_HANDLE_langFilter(lang_id)}
          key={lang_id + "langFilter"}
        />
      ))}
      {difficulty_FILTERS.map((diff) => (
        <BulletDifficultyFilter_BTN
          difficulty={diff}
          REMOVE_difficulty={() => z_HANDLE_difficultyFilter(diff)}
          key={diff + "diffFilter"}
        />
      ))}
      {SHOULD_filterByMarked ? (
        <BulletMarkedFilter_BTN
          REMOVE_markedFilter={() => z_TOGGLE_filterByMarked()}
        />
      ) : null}
    </>
  );
}
