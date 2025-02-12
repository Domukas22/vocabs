//
//
//

import { Error_TYPES } from "@/src/types/error_TYPES";
import { Keyboard } from "react-native";

export function HANDLE_keyboardDismiss(error_TYPE: Error_TYPES | undefined) {
  if (error_TYPE && error_TYPE !== "form_input") {
    Keyboard.dismiss();
  }
}
