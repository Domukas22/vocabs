//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { Ref, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { ICON_search, ICON_X } from "../icons/icons";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  _ref?: Ref<TextInput>;
  SET_value:
    | React.Dispatch<React.SetStateAction<string>>
    | ((val: string) => void);
}

export default function SearchBar({ value, SET_value, _ref }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { t } = useTranslation();
  return (
    <View style={s.wrapper}>
      <View style={s.leftIconWrapper}>
        <ICON_search big={false} />
      </View>
      <TextInput
        ref={_ref}
        style={s.textInput}
        placeholder={t("other.searchPlaceholder")}
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
    height: 48,
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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    color: MyColors.text_white,
  },
});
