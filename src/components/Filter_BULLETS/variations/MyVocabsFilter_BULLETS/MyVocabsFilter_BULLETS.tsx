//
//
//

import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import { BulletDifficultyFilter_BTN, BulletLangFilter_BTN } from "../../parts";

export function MyVocabsFilter_BULLETS() {
  const {
    z_myVocabDisplay_SETTINGS,
    z_REMOVE_langFilter,
    z_REMOVE_difficultyFilter,
  } = z_USE_myVocabsDisplaySettings();

  const { langFilters = [], difficultyFilters = [] } =
    z_myVocabDisplay_SETTINGS;

  return (
    <>
      {langFilters.map((lang_id) => (
        <BulletLangFilter_BTN
          key={lang_id}
          lang_id={lang_id}
          REMOVE_lang={() => z_REMOVE_langFilter(lang_id)}
        />
      ))}
      {difficultyFilters.map((difficulty) => (
        <BulletDifficultyFilter_BTN
          key={difficulty}
          difficulty={difficulty}
          REMOVE_difficulty={() => z_REMOVE_difficultyFilter(difficulty)}
        />
      ))}
    </>
  );
}
