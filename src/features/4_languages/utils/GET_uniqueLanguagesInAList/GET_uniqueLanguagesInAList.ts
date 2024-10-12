//
//
//

import { Language_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";

export default async function GET_uniqueLanguagesInAList(
  vocabs: Vocab_MODEL[],
  languages: Language_MODEL[]
) {
  const lang_IDs = vocabs.reduce((acc, vocab) => {
    vocab.trs?.forEach((translation) => {
      if (!acc.includes(translation.lang_id)) {
        acc.push(translation.lang_id);
      }
    });
    return acc;
  }, [] as string[]);

  // Filter languages based on the unique language IDs
  const uniqueLanguages = languages.filter((lang) =>
    lang_IDs.includes(lang.id)
  );

  return uniqueLanguages;
}
