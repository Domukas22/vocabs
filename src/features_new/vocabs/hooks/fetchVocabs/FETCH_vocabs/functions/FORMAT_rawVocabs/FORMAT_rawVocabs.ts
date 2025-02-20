//
//
//

import { raw_Vocab_TYPE, Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function FORMAT_rawVocabs(vocabs: raw_Vocab_TYPE[]): {
  formated_VOCABS: Vocab_TYPE[];
} {
  const formated_VOCABS: Vocab_TYPE[] = vocabs.map((vocab) => ({
    ...vocab,
    lang_ids: vocab.lang_ids.split(", ").map((id) => id.trim()), // Convert string to array
  }));

  return { formated_VOCABS };
}
