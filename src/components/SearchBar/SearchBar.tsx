//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { ICON_search, ICON_X } from "../icons/icons";

interface SearchBarProps {
  value: string;
  SET_value:
    | React.Dispatch<React.SetStateAction<string>>
    | ((val: string) => void);
}

export default function SearchBar({ value, SET_value }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={s.wrapper}>
      <View style={s.leftIconWrapper}>
        <ICON_search big={false} />
      </View>
      <TextInput
        style={s.textInput}
        placeholder="Search..."
        placeholderTextColor={MyColors.text_white_06}
        value={value}
        onChangeText={SET_value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {value !== "" && (
        <Pressable style={s.rightIconWrapper} onPress={() => SET_value("")}>
          <ICON_X big={true} rotate={true} />
        </Pressable>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    height: 44,
  },
  leftIconWrapper: {
    position: "absolute",
    left: 16,
    zIndex: 10,
  },
  rightIconWrapper: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },
  textInput: {
    paddingLeft: 44,
    paddingRight: 44,
    fontSize: 18,
    fontFamily: "Nunito-Light",
    flex: 1,
    backgroundColor: MyColors.btn_2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    color: MyColors.text_white,
  },
});
