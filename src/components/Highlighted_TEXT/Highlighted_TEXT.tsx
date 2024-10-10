//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";

interface RenderTextWithhighlights_PROPS {
  text: string;
  highlights: number[];
  diff: 0 | 1 | 2 | 3 | undefined;
  light?: boolean;
}

export default function Highlighted_TEXT({
  text,
  highlights,
  diff,
  light = false,
}: RenderTextWithhighlights_PROPS) {
  const highlightTextColor =
    diff === 3
      ? MyColors.text_difficulty_3
      : diff === 2
      ? MyColors.text_difficulty_2
      : diff === 1
      ? MyColors.text_difficulty_1
      : MyColors.text_primary;

  const textDecorationLine = diff === 1 ? "underline" : undefined;

  return (
    <Styled_TEXT>
      {text?.split("").map((letter, index) => {
        const isHighlighted =
          highlights?.map(Number)?.includes(index) && letter !== " ";
        return (
          <Styled_TEXT
            key={index}
            style={[
              isHighlighted && { color: highlightTextColor },
              isHighlighted && diff === 1 && { textDecorationLine },
              light && { fontFamily: "Nunito-Light" },
            ]}
            // style={[
            //   isHighlighted && { color },
            //   diff === 1 && { textDecorationLine: "underline" },
            // ]}
          >
            {letter}
          </Styled_TEXT>
        );
      })}
    </Styled_TEXT>
  );
}
