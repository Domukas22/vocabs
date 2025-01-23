//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";

export default function HighlightByLetter_BTN({
  letter,
  index,
  active,
  diff,
  HANDLE_index,
}: {
  letter: string;
  index: number;
  active: boolean;
  diff: 0 | 1 | 2 | 3;
  HANDLE_index: (index: number) => void;
}) {
  const btnType = () => {
    if (!active) return "simple";
    if (active && letter !== " ") return `difficulty_${diff || 3}_active`;

    return "simple";
  };

  return (
    <Btn
      key={"highlight btn" + index + letter}
      text={letter}
      type={btnType()}
      style={[
        {
          borderRadius: 8,
          width: "10%",
          paddingHorizontal: 0,
          paddingVertical: 0,
          height: 50,
        },
        letter === " " && { opacity: 0 },
      ]}
      onPress={() => {
        if (letter !== " ") {
          HANDLE_index(index);
        }
      }}
      text_STYLES={{ fontSize: 20, fontFamily: "Nunito-SemiBold" }}
    />
  );
}
