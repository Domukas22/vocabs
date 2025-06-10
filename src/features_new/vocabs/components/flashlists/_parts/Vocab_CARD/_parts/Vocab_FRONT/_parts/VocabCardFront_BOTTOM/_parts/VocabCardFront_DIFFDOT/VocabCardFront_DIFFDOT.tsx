//
//
//

import {
  ICON_difficulty,
  ICON_difficultyDot,
} from "@/src/components/1_grouped/icons/icons";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function VocabCardFront_DIFFDOT({
  vocab,
  SHOW_difficulty = false,
}: {
  vocab: Vocab_TYPE;
  SHOW_difficulty: boolean;
}) {
  const { difficulty = 3, type = "private" } = vocab;

  return SHOW_difficulty && type === "private" ? (
    <ICON_difficulty difficulty={difficulty} size="tiny" />
  ) : null;
}
