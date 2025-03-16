//
//
//

import { MyColors } from "@/src/constants/MyColors";
import React, { Ref } from "react";
import { TextStyle } from "react-native";

import {
  View,
  StyleSheet,
  TextInput as R_TextInput,
  TextInputProps,
} from "react-native";
import { ICON_toastNotification } from "@/src/components/1_grouped/icons/icons";

type _TextInputProps = TextInputProps & {
  value: string;
  HAS_error: boolean;
  isSubmitted: boolean;
  SET_value: (val: string) => void;
  isFocused: boolean;
  setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder?: string;
  multiline?: boolean;
  staySmall?: boolean;
  _ref?: Ref<R_TextInput>;
  props?: TextInputProps;
};

export default function StyledText_INPUT({
  value,
  SET_value,
  placeholder,
  multiline = false,
  HAS_error = false,
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
          HAS_error && s.error,
          isSubmitted &&
            !HAS_error &&
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
      {isSubmitted && !HAS_error && isFocused && (
        <View style={{ position: "absolute", right: 12 }}>
          <ICON_toastNotification type="success" />
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  textInput: {
    height: 54,
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
