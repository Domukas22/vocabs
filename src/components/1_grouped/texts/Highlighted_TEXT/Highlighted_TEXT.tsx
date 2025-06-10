//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React from "react";
import { Styled_TEXT } from "../Styled_TEXT/Styled_TEXT";

interface RenderTextWithhighlights_PROPS {
  text: string;
  highlights: number[];
  diff: 0 | 1 | 2 | 3 | 4 | 5 | undefined;
  light?: boolean;
  big?: boolean;
}

const Highlighted_TEXT = React.memo(function Highlighted_TEXT({
  text,
  highlights,
  diff,
  light = false,
  big = false,
}: RenderTextWithhighlights_PROPS) {
  const highlightTextColor =
    diff === 5
      ? MyColors.text_red
      : diff === 4
      ? MyColors.text_green
      : diff === 3
      ? MyColors.text_difficulty_3
      : diff === 2
      ? MyColors.text_difficulty_2
      : diff === 1
      ? MyColors.text_difficulty_1
      : MyColors.text_primary;

  // const textDecorationLine = diff === 1 ? "underline" : undefined;
  const textDecorationLine = "underline";

  return (
    <Styled_TEXT>
      {/* Use Array.from() to handle emojis properly */}
      {Array.from(text).map((character, index) => {
        const isHighlighted =
          highlights?.map(Number)?.includes(index) && character !== " ";

        const IS_spaceBetweenHighlighted =
          character === " " &&
          highlights?.map(Number)?.includes(index - 1) &&
          highlights?.map(Number)?.includes(index + 1);

        return (
          <Styled_TEXT
            key={index}
            style={[
              { fontFamily: "Nunito-Medium" },
              IS_spaceBetweenHighlighted && {
                color: highlightTextColor,
                textDecorationLine,
              },
              isHighlighted && {
                color: highlightTextColor,
                textDecorationLine,
              },
              isHighlighted && diff === 1 && { textDecorationLine },

              light && { fontFamily: "Nunito-Light" },
              big && {
                fontSize: 20,
                letterSpacing: -0.1,
              },
            ]}
          >
            {character}
          </Styled_TEXT>
        );
      })}
    </Styled_TEXT>
  );
});

export default Highlighted_TEXT;
