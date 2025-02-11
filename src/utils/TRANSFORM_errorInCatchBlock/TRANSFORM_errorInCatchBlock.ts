//
//
//

import { Error_PROPS } from "@/src/props";
import { CHECK_ifNetworkFailure } from "../CHECK_ifNetworkFailure/CHECK_ifNetworkFailure";
import { DEFAULT_userErrorMsg } from "@/src/constants/globalVars";

export function TRANSFORM_errorInCatchBlock<
  validInput_NAMES extends string = string
>({
  error,
  function_NAME,
}: {
  error: any;
  function_NAME: string;
}): Error_PROPS<validInput_NAMES> {
  const IS_networkFailure = CHECK_ifNetworkFailure(error);

  const type = IS_networkFailure
    ? "user_network"
    : error?.error_TYPE || "unknown";

  // const details = type === "unknown" ? error : error.error_DETAILS;
  const details = error?.error_DETAILS ? error.error_DETAILS : error;

  return {
    user_MSG: IS_networkFailure
      ? "There seems to an issue with your internet connection"
      : DEFAULT_userErrorMsg,
    internal_MSG: error?.internal_MSG || error?.message,
    error_TYPE: type,
    error_DETAILS: details,
    falsyForm_INPUTS: error?.falsyForm_INPUTS,
    function_NAME,
  };
}
