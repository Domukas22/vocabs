//
//
//

import { Error_TYPES } from "../../../types/error_TYPES";
import { CHECK_ifNetworkFailure } from "../../CHECK_ifNetworkFailure/CHECK_ifNetworkFailure";

export function GET_errorType(error: any): Error_TYPES {
  const IS_networkError = CHECK_ifNetworkFailure(error) || false;
  const IS_customError = error?.IS_customError;
  return IS_networkError
    ? "user_network"
    : IS_customError
    ? error?.type
    : "internal";
}
