//
//
//

import { Language_MODEL, Vocab_MODEL } from "@/src/db/props";

export default function GET_uniqueLanguagesInAList(
  vocabs: Vocab_MODEL[],
  languages: Language_MODEL[]
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
