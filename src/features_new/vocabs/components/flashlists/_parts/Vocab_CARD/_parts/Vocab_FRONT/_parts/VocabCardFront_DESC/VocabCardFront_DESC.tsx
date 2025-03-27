//
//
//

import { Styled_TEXT } from "@/src/components/1_grouped/texts/Styled_TEXT/Styled_TEXT";
import { Vocab_TYPE } from "@/src/features_new/vocabs/types";

export function VocabCardFront_DESC({
  vocab,
  SHOW_description = false,
}: {
  vocab: Vocab_TYPE;
  SHOW_description: boolean;
}) {
  const { description = "" } = vocab;

  return description && SHOW_description ? (
    <Styled_TEXT
      type="label_small"
      style={{ marginRight: 44 /* for the vocab select checkbox*/ }}
    >
      {description}
    </Styled_TEXT>
  ) : null;
}
