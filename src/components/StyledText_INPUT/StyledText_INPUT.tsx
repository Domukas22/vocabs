//
//
//

import { MyColors } from "@/src/constants/MyColors";
import { useFonts } from "expo-font";
import React, { Ref, useState } from "react";
import { FieldError } from "react-hook-form";
import { TextStyle } from "react-native";

import {
  View,
  StyleSheet,
  TextInput as R_TextInput,
  KeyboardAvoidingView,
  Platform,
  TextInputProps,
} from "react-native";
import { ICON_toastNotification } from "../icons/icons";

type _TextInputProps = TextInputProps & {
  value: string;
  SET_value: (val: string) => void;
  placeholder?: string;
  error: FieldError | undefined;
  isSubmitted?: boolean;
  multiline?: boolean;
  staySmall?: boolean;
  _ref?: Ref<R_TextInput>;
  props?: TextInputProps;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function StyledText_INPUT({
  value,
  SET_value,
  placeholder,
  multiline = false,
  error = undefined,
  isSubmitted = false,
  style,
  _ref,
  isFocused,
  setIsFocused,
  staySmall = false,
  props,
}: _TextInputProps) {
  return (
    <View style={{ justifyContent: "center" }}>
      <R_TextInput
        style={[
          s.textInput,
          multiline && { height: "auto" },
          multiline && !staySmall && { minHeight: 100 },
          error && s.error,
          isSubmitted &&
            !error &&
            isFocused && { ...s.IS_errorCorrected, paddingRight: 44 },
          style,
        ]}
        placeholder={placeholder && placeholder}
        multiline={multiline}
        scrollEnabled={false}
        numberOfLines={multiline ? 4 : 1}
        placeholderTextColor={MyColors.text_white_06}
        value={value}
        onChangeText={SET_value}
        onFocus={() => !!setIsFocused && setIsFocused(true)}
        onBlur={() => !!setIsFocused && setIsFocused(false)}
        ref={_ref && _ref}
        {...props}
      />
      {isSubmitted && !error && isFocused && (
        <View style={{ position: "absolute", right: 12 }}>
          <ICON_toastNotification type="success" />
        </View>
      )}
    </View>
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

  error: {
    borderColor: MyColors.border_red,
  },
  IS_errorCorrected: {
    borderColor: MyColors.border_green,
  },
});
