//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";

interface RenderTextWithhighlights_PROPS {
  text: string;
  highlights: number[];
  modal_DIFF: 0 | 1 | 2 | 3;
}

export default function Highlighted_TEXT({
  text,
  highlights,
  modal_DIFF,
}: RenderTextWithhighlights_PROPS) {
  const highlightTextColor =
    modal_DIFF === 3
      ? MyColors.text_difficulty_3
      : modal_DIFF === 2
      ? MyColors.text_difficulty_2
      : modal_DIFF === 1
      ? MyColors.text_difficulty_1
      : MyColors.text_primary;

  const textDecorationLine = modal_DIFF === 1 ? "underline" : undefined;

  return (
    <Styled_TEXT>
      {text?.split("").map((letter, index) => {
        const isHighlighted = highlights?.includes(index);
        return (
          <Styled_TEXT
            key={index}
            style={[
              isHighlighted && { color: highlightTextColor },
              isHighlighted && modal_DIFF === 1 && { textDecorationLine },
            ]}
            // style={[
            //   isHighlighted && { color },
            //   modal_DIFF === 1 && { textDecorationLine: "underline" },
            // ]}
          >
            {letter}
          </Styled_TEXT>
        );
      })}
    </Styled_TEXT>
  );
}
