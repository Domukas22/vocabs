//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";

export default function HighlightByWord_BTN({
  word,
  index,
  active,
  diff,
  HANDLE_word,
}: {
  word: string;
  index: number;
  active: boolean;
  diff: 0 | 1 | 2 | 3;
  HANDLE_word: () => void;
}) {
  const btnType = () => (active ? `difficulty_${diff || 3}_active` : "simple");

  return (
    <Btn
      key={"highlight word btn" + index + word}
      text={word}
      type={btnType()}
      style={{
        marginRight: 4,
        marginBottom: 4,
        paddingVertical: 0,
        height: 50,
      }}
      onPress={HANDLE_word}
      text_STYLES={{
        fontSize: 18,
        fontFamily: "Nunito-SemiBold",
      }}
    />
  );
}
