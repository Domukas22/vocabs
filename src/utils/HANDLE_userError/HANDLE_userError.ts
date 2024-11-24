//
//
//

import { Error_PROPS } from "@/src/props";

export default function HANDLE_userError<
  validInput_NAMES extends string = string
>({
  error,
  function_NAME,
  internalErrorUser_MSG,
}: {
  error: any;
  function_NAME: string;
  internalErrorUser_MSG: string;
}): Error_PROPS<validInput_NAMES> {
  const type = error.error_TYPE || "unknown";
  const details = type === "unkown" ? error : error.error_DETAILS;

  return {
    user_MSG: error.user_MSG || internalErrorUser_MSG,
    internal_MSG: error.internal_MSG || error.message,
    error_TYPE: type,
    error_DETAILS: details,
    falsyForm_INPUTS: error.falsyForm_INPUTS,
    function_NAME,
  };
}
