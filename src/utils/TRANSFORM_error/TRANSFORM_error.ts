//
//
//

import { Error_PROPS } from "@/src/props";
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

  const internal_MSG = error?.internal_MSG || error?.message;

  const error_TYPE = IS_networkFailure
    ? "user_network"
    : error?.error_TYPE || "unknown";

  // const details = type === "unknown" ? error : error.error_DETAILS;
  const error_DETAILS = error?.error_DETAILS ? error.error_DETAILS : error;

  return {
    user_MSG,
    internal_MSG,
    error_TYPE,
    error_DETAILS,
    falsyForm_INPUTS: error?.falsyForm_INPUTS,
    function_NAME,
  };
}
