//
//
//

import { CREATE_internalErrorMsg } from "../../../constants/globalVars";
import { Error_TYPES } from "../../../props";

export function GET_errorMessage({
  error,
  error_TYPE = "internal",
  process,
}: {
  error: any;
  error_TYPE: Error_TYPES;
  process: string;
}) {
  return error_TYPE === "user_network"
    ? "There seems to be a problem with your internet connection"
    : error_TYPE === "internal"
    ? CREATE_internalErrorMsg(process)
    : error?.message || CREATE_internalErrorMsg(process);
}
