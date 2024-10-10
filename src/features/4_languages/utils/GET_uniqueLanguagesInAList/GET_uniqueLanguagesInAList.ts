//
//
//

import { Language_PROPS, Vocab_PROPS } from "@/src/db/props";

export default function GET_uniqueLanguagesInAList(
  vocabs: Vocab_PROPS[],
  languages: Language_PROPS[]
) {
  const lang_IDs = vocabs.reduce((acc, vocab) => {
    vocab.translations?.forEach((tr) => {
      if (!acc.includes(tr.lang_id)) acc.push(tr.lang_id);
    });

    return acc;
  }, [] as string[]);

  const langs = languages.filter((lang) => lang_IDs.includes(lang.id));
  return langs;
}
