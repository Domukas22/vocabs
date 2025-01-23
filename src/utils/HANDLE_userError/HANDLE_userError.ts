//
//
//

import { Error_PROPS } from "@/src/props";
import { CHECK_ifNetworkFailure } from "../CHECK_ifNetworkFailure/CHECK_ifNetworkFailure";

export function HANDLE_userError<validInput_NAMES extends string = string>({
  error,
  function_NAME,
  internalErrorUser_MSG,
}: {
  error: any;
  function_NAME: string;
  internalErrorUser_MSG: string;
}): Error_PROPS<validInput_NAMES> {
  const IS_networkFailure = CHECK_ifNetworkFailure(error);
  const type = IS_networkFailure
    ? "user_network"
    : error.error_TYPE || "unknown";
  const details = type === "unknown" ? error : error.error_DETAILS;

  return {
    user_MSG: IS_networkFailure
      ? "There seems to an issue with your internet connection"
      : error.user_MSG || internalErrorUser_MSG,
    internal_MSG: error.internal_MSG || error.message,
    error_TYPE: type,
    error_DETAILS: details,
    falsyForm_INPUTS: error.falsyForm_INPUTS,
    function_NAME,
  };
}
