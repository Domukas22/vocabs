//
//
//

import { Vocab_PROPS } from "@/src/db/props";

export default function GET_uniqueTagsInAList(vocabs: Vocab_PROPS[]) {
  const tags = vocabs.reduce((acc, vocab) => {
    vocab.tags?.forEach((tag) => {
      if (!acc.includes(tag)) acc.push(tag);
    });

    return acc;
  }, [] as string[]);

  return tags;
}
