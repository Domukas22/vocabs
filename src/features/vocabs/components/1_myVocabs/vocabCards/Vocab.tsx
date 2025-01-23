//
//
//
//

import { MyColors } from "@/src/constants/MyColors";
import Vocab_MODEL from "@/src/db/models/Vocab_MODEL";
import { USE_toggle } from "@/src/hooks/USE_toggle/USE_toggle";
import { StyleSheet, View } from "react-native";
import Vocab_FRONT from "./Components/Vocab_FRONT/Vocab_FRONT";
import VocabBottomText_WRAP from "./Components/VocabBottomText_WRAP/VocabBottomText_WRAP";
import { VocabBack_TRS } from "./Components/VocabBack_TRS/VocabBack_TRS";

export function Vocab({
  vocab,
  highlighted = false,
  vocabBack_BTNS,
  SHOW_list = false,
}: {
  vocab: Vocab_MODEL | undefined;
  highlighted?: boolean;
  vocabBack_BTNS: (TOGGLE_vocab: () => void) => React.ReactNode;
  SHOW_list?: boolean;
  SHOW_username?: boolean;
}) {
  const [open, TOGGLE_open] = USE_toggle(false);
  return (
    <View
      style={[
        s.vocab,
        open && s.vocab_open,
        open && s[`difficulty_${0}`],
        highlighted && s.highlighted,
      ]}
    >
      {!open && (
        <Vocab_FRONT
          trs={vocab?.trs || []}
          difficulty={0}
          description={vocab?.description}
          TOGGLE_open={TOGGLE_open}
        />
      )}

      {open && (
        <>
          <VocabBack_TRS trs={vocab?.trs || []} difficulty={0} />
          <VocabBottomText_WRAP
            desc={vocab?.description || ""}
            list_NAME={
              SHOW_list && vocab?.list?.name ? vocab?.list?.name : undefined
            }
          />
          {vocabBack_BTNS(TOGGLE_open)}
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  vocab: {
    borderRadius: 12,
    backgroundColor: MyColors.btn_2,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    overflow: "hidden",
    width: "100%",
    minWidth: "100%",
  },
  vocab_open: {
    backgroundColor: MyColors.fill_bg,
  },
  difficulty_3: {
    borderColor: MyColors.border_difficulty_3,
  },
  difficulty_2: {
    borderColor: MyColors.border_difficulty_2,
  },
  difficulty_1: {
    borderColor: MyColors.border_difficulty_1,
  },
  difficulty_0: {
    borderColor: MyColors.border_primary,
  },
  highlighted: {
    borderColor: MyColors.border_green,
    backgroundColor: MyColors.btn_green,
  },
});
