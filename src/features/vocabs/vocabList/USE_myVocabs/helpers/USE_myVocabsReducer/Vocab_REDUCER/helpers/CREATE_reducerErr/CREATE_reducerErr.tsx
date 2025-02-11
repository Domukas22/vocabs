//
//
//

import { Error_PROPS } from "@/src/props";
import { TRANSFORM_error } from "@/src/utils";

export function CREATE_reducerErr(
  function_NAME: string,
  message: string
): { error: Error_PROPS } {
  return { error: TRANSFORM_error(function_NAME, { message }) };
}
