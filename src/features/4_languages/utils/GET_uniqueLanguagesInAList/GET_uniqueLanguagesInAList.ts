//
//
//

import { languagesArr_PROPS } from "@/src/constants/languages";
import { Translations_DB } from "@/src/db";
import { Language_PROPS, Vocab_PROPS } from "@/src/db/props";
import { Language_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Q } from "@nozbe/watermelondb";

export default async function GET_uniqueLanguagesInAList(
  vocabs: Vocab_MODEL[],
  languages: Language_MODEL[]
) {
  const vocab_IDS = vocabs?.map((v) => v.id);

  const trs = await Translations_DB.query(
    Q.where("vocab_id", Q.oneOf(vocab_IDS))
  ).fetch();

  const lang_IDs = trs.reduce((acc, translation) => {
    if (!acc.includes(translation.lang_id)) acc.push(translation.lang_id);
    return acc;
  }, [] as string[]);

  // Filter languages based on the unique language IDs
  const uniqueLanguages = languages.filter((lang) =>
    lang_IDs.includes(lang.id)
  );

  return uniqueLanguages;
}
