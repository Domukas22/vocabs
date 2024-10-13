//
//
//

import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";

export default function GET_uniqueTagsInAList(vocabs: Vocab_MODEL[]) {
  const tags = vocabs.reduce((acc, vocab) => {
    vocab.tags?.forEach((tag) => {
      if (!acc.includes(tag)) acc.push(tag);
    });

    return acc;
  }, [] as string[]);

  return tags;
}
