import HighlightByLetter_BTN from "../HighlightByLetter_BTN/HighlightByLetter_BTN";

export default function GET_letterBtns({
  text,
  highlights,
  diff,
  SEThighlights,
}: {
  text: string;
  highlights: number[];
  diff: 0 | 1 | 2 | 3;
  SEThighlights: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  function HANDLE_index(index: number) {
    let updatedIndexes: number[];
    if (highlights.includes(index)) {
      // If index is already highlighted, remove it
      updatedIndexes = highlights.filter((i) => i !== index);
    } else {
      // If index is not highlighted, add it
      updatedIndexes = [...highlights, index];
    }

    // Update the highlights state with the new string
    SEThighlights(updatedIndexes);
  }

  const buttons = [];
  const characters = Array.from(text); // Handle emojis and multi-codepoint chars properly

  characters.forEach((char, index) => {
    const isEmoji = /\p{Emoji}/u.test(char); // Check if the character is an emoji

    if (isEmoji) {
      // If it's an emoji, add it as a single button
      buttons.push(
        HighlightByLetter_BTN({
          letter: char,
          index,
          active: highlights.includes(index),
          diff,
          HANDLE_index,
        })
      );
    } else {
      // For normal letters, add them as individual buttons
      buttons.push(
        HighlightByLetter_BTN({
          letter: char,
          index,
          active: highlights.includes(index),
          diff,
          HANDLE_index,
        })
      );
    }
  });

  return buttons;
}
