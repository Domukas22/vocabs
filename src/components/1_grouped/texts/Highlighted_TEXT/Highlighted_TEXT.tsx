//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";

interface RenderTextWithhighlights_PROPS {
  text: string;
  highlights: number[];
  diff: 0 | 1 | 2 | 3 | undefined;
  light?: boolean;
}

const Highlighted_TEXT = React.memo(function Highlighted_TEXT({
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
      {/* Use Array.from() to handle emojis properly */}
      {Array.from(text).map((char, index) => {
        const isHighlighted =
          highlights?.map(Number)?.includes(index) && char !== " ";
        return (
          <Styled_TEXT
            key={index}
            style={[
              { fontFamily: "Nunito-Medium" },
              isHighlighted && { color: highlightTextColor },
              isHighlighted && diff === 1 && { textDecorationLine },
              // { fontFamily: "Nunito-Medium" },
              light && { fontFamily: "Nunito-Light" },
            ]}
          >
            {char}
          </Styled_TEXT>
        );
      })}
    </Styled_TEXT>
  );
});

export default Highlighted_TEXT;
