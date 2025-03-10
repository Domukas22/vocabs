//
//
//

import { ICON_markedStar } from "@/src/components/1_grouped/icons/icons";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function VocabCardFront_MARKEDSTAR({ vocab }: { vocab: Vocab_TYPE }) {
  const { is_marked = false, type = "private" } = vocab;

  return is_marked && type === "private" ? (
    <ICON_markedStar color="green" size="tiny" />
  ) : null;
}
