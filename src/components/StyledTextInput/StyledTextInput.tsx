//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { useFonts } from "expo-font";
import React, { Ref, useState } from "react";
import { TextStyle } from "react-native";

import {
  View,
  StyleSheet,
  TextInput as R_TextInput,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from "react-native";

type _TextInputProps = TextInputProps & {
  value: string;
  SET_value: (val: string) => void;
  placeholder: string;
  multiline?: boolean;
  _ref?: Ref<R_TextInput>;
};

export default function StyledTextInput({
  value,
  SET_value,
  placeholder,
  multiline = false,
  style,
  _ref,
}: _TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <R_TextInput
      style={[s.textInput, multiline && { minHeight: 120, height: 120 }, style]}
      placeholder={placeholder ? placeholder : "A nice placeholder..."}
      multiline={multiline}
      placeholderTextColor={MyColors.text_white_06}
      value={value}
      onChangeText={SET_value}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      scrollEnabled={false}
      ref={_ref && _ref}
    />
  );
}

const s = StyleSheet.create({
  textInput: {
    height: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,

    verticalAlign: "top",
    fontSize: 18,
    fontFamily: "Nunito-Light",

    backgroundColor: MyColors.btn_2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MyColors.border_white_005,
    color: MyColors.text_white,
  } as TextStyle,
});
