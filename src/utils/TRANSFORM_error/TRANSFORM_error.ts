//
//
//

import { Error_PROPS } from "@/src/types/error_TYPES";
import { CHECK_ifNetworkFailure } from "../CHECK_ifNetworkFailure/CHECK_ifNetworkFailure";
import { DEFAULT_userErrorMsg } from "@/src/constants/globalVars";

export function TRANSFORM_error<validInput_NAMES extends string = string>(
  function_NAME: string,
  error: any
): Error_PROPS<validInput_NAMES> {
  const IS_networkFailure = CHECK_ifNetworkFailure(error);

  const user_MSG = IS_networkFailure
    ? "There seems to an issue with your internet connection"
    : DEFAULT_userErrorMsg;

  const message = error?.message || error?.message;

  // const details = type === "unknown" ? error : error.error_DETAILS;
  const error_DETAILS = error?.error_DETAILS ? error.error_DETAILS : error;

  return {
    user_MSG,
    message,
    error_TYPE: "general",
    error_DETAILS,
    falsyForm_INPUTS: error?.falsyForm_INPUTS,
    function_NAME,
  };
}
