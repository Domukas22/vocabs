//
//
//
//

import Block from "@/src/components/Block/Block";
import Btn from "@/src/components/Btn/Btn";
import Label from "@/src/components/Label/Label";
import { View } from "react-native";

interface DifficultyInputs_PROPS {
  modal_DIFF: 1 | 2 | 3;
  SET_modalDiff: React.Dispatch<React.SetStateAction<1 | 2 | 3>>;
}

export default function Difficulty_INPUTS({
  modal_DIFF,
  SET_modalDiff,
}: DifficultyInputs_PROPS) {
  return (
    <Block>
      <Label>Vocab difficulty</Label>
      <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
        <Btn
          text="Easy"
          onPress={() => {
            SET_modalDiff(1);
          }}
          type={modal_DIFF === 1 ? "difficulty_1_active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ textAlign: "center" }}
        />
        <Btn
          text="Medium"
          onPress={() => {
            SET_modalDiff(2);
          }}
          type={modal_DIFF === 2 ? "difficulty_2_active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ textAlign: "center" }}
        />
        <Btn
          text="Hard"
          onPress={() => {
            SET_modalDiff(3);
          }}
          type={modal_DIFF === 3 ? "difficulty_3_active" : "simple"}
          style={{ flex: 1 }}
          text_STYLES={{ textAlign: "center" }}
        />
      </View>
    </Block>
  );
}
