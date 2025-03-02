//
//
//

import { z_USE_myVocabsDisplaySettings } from "@/src/features_new/vocabs/hooks/zustand/displaySettings/z_USE_myVocabsDisplaySettings/z_USE_myVocabsDisplaySettings";
import {
  BulletDifficultyFilter_BTN,
  BulletLangFilter_BTN,
  BulletMarkedFilter_BTN,
} from "../../parts";

export function MyVocabsFilter_BULLETS() {
  const {
    filters,
    z_HANDLE_langFilter,
    z_HANDLE_difficultyFilter,
    z_HANDLE_markedFilter,
  } = z_USE_myVocabsDisplaySettings();

  const { langs = [], difficulties = [], byMarked = false } = filters;

  return (
    <>
      {langs.map((lang_id) => (
        <BulletLangFilter_BTN
          key={lang_id}
          lang_id={lang_id}
          REMOVE_lang={() => z_HANDLE_langFilter(lang_id)}
        />
      ))}
      {difficulties.map((difficulty) => (
        <BulletDifficultyFilter_BTN
          key={difficulty}
          difficulty={difficulty}
          REMOVE_difficulty={() => z_HANDLE_difficultyFilter(difficulty)}
        />
      ))}
      {byMarked ? (
        <BulletMarkedFilter_BTN REMOVE_markedFilter={z_HANDLE_markedFilter} />
      ) : null}
    </>
  );
}
