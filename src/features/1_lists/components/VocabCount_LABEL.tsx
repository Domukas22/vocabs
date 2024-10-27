//
//
//

import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

export default function VocabCount_LABEL({
  vocab_COUNT = 0,
}: {
  vocab_COUNT: number;
}) {
  return (
    <Styled_TEXT type="label_small" style={{ marginRight: "auto" }}>
      {vocab_COUNT > 0 ? `${vocab_COUNT} vocabs` : "Empty list"}
    </Styled_TEXT>
  );
}
