//
//
//

import db, { Errors_DB } from "../../db";
import Error_MODEL from "../../db/models/Error_MODEL";
import { Error_PROPS, General_ERROR } from "../../types/error_TYPES";

const GET_readableDateNow = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" });

export async function SEND_internalError(error: General_ERROR) {
  console.warn("------------------------------------------------");
  console.error(`🔴 ${error.function_NAME} => ${error.message}`);

  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));
}
