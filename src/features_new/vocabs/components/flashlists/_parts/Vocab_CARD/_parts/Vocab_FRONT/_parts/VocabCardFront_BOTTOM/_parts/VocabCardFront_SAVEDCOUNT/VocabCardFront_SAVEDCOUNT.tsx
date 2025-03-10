//
//
//

import { ICON_savedCount } from "@/src/components/1_grouped/icons/icons";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function VocabCardFront_SAVEDCOUNT({ vocab }: { vocab: Vocab_TYPE }) {
  const { saved_count = 0, type = "private" } = vocab;

  return type === "public" ? <ICON_savedCount count={saved_count} /> : null;
}
