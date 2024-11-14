//
//
//

import { Language_MODEL } from "../watermelon_MODELS";

export default function TURN_langExampleHighlightsIntoJson(languages: {
  created?: Language_MODEL[];
  updated?: Language_MODEL[];
  deleted?: string[];
}) {
  return {
    ...languages,
    updated:
      languages.updated?.map((list) => ({
        ...list,
        translation_example_highlights: JSON.stringify(
          list.translation_example_highlights
        ),
      })) || [],
    created:
      languages.created?.map((list) => ({
        ...list,
        translation_example_highlights: JSON.stringify(
          list.translation_example_highlights
        ),
      })) || [],
  };
}
