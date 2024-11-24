//
//
//

import { Error_TYPES } from "@/src/props";
import { Keyboard } from "react-native";

export default function HANDLE_keyboardDismiss(
  error_TYPE: Error_TYPES | undefined
) {
  if (error_TYPE && error_TYPE !== "form_input") {
    Keyboard.dismiss();
  }
}
