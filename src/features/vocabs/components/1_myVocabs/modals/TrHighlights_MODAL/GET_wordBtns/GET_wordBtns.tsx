//
//
//

import HighlightByWord_BTN from "../HighlightByWord_BTN/HighlightByWord_BTN";

export default function GET_wordBtns({
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
  const stayWithWord = "'\"()"; // Characters that should stay attached to words
  const wordsAndSymbols = [];
  let currentWord = "";
  let currentIndexes: number[] = []; // Array to store the indices for the current word

  // Helper to push the current word along with its indices
  function pushCurrentWord() {
    if (currentWord) {
      wordsAndSymbols.push({ word: currentWord, indexes: currentIndexes });
      currentWord = "";
      currentIndexes = [];
    }
  }

  // Process each character in the text
  Array.from(text).forEach((char, index) => {
    const isWordChar = /\w/.test(char); // Alphanumeric characters
    const isStayWithWordChar = stayWithWord.includes(char); // Characters like ', ", (, )
    const isEmoji = /\p{Emoji}/u.test(char); // Check if it's an emoji
    const isSpace = /\s/.test(char); // Spaces split words
    const isPunctuation = /[.,!?]/.test(char); // Common punctuation

    // If it's an emoji, treat it as its own word
    if (isEmoji) {
      pushCurrentWord(); // Push any current word
      wordsAndSymbols.push({ word: char, indexes: [index] });
      return;
    }

    // If it's a space, push the current word to the array and reset
    if (isSpace) {
      pushCurrentWord();
      return;
    }

    // If it's punctuation like ! or ., treat it as its own symbol unless it's part of `stayWithWord`
    if (isPunctuation) {
      pushCurrentWord(); // Push the current word before handling punctuation
      wordsAndSymbols.push({ word: char, indexes: [index] });
      return;
    }

    // If it's a stay-with-word character, attach it to the word
    if (isStayWithWordChar) {
      if (currentWord) {
        currentWord += char; // Attach to the current word
        currentIndexes.push(index);
      } else {
        currentWord = char; // Start a new word
        currentIndexes = [index];
      }
      return;
    }

    // If it's a normal word character, add it to the current word
    currentWord += char;
    currentIndexes.push(index);
  });

  // Push any remaining word
  pushCurrentWord();

  function HANDLE_word(wordIndexes: number[]) {
    const allHighlighted = wordIndexes.every((i) => highlights.includes(i));

    let updatedIndexes: number[];
    if (allHighlighted) {
      updatedIndexes = highlights.filter((i) => !wordIndexes.includes(i));
    } else {
      updatedIndexes = [
        ...highlights,
        ...wordIndexes.filter((i) => !highlights.includes(i)),
      ];
    }

    SEThighlights(updatedIndexes);
  }

  // Render buttons for each word or symbol group
  return wordsAndSymbols.map(({ word, indexes }, groupIndex) => {
    const active = indexes.every((index) => highlights.includes(index));

    return HighlightByWord_BTN({
      word,
      index: groupIndex,
      active,
      diff,
      HANDLE_word: () => HANDLE_word(indexes),
    });
  });
}
