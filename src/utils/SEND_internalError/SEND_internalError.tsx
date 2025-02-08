//
//
//

import db, { Errors_DB } from "../../db";
import Error_MODEL from "../../db/models/Error_MODEL";
import { Error_PROPS } from "../../props";

const GET_readableDateNow = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" });

export async function SEND_internalError(error: Error_PROPS) {
  if (error.error_TYPE !== "internal" && error.error_TYPE !== "unknown") return;

  console.log("------------------------------------------------");
  console.error(`🔴 ${error.function_NAME} => ${error.internal_MSG}`);
  if (error.error_DETAILS) {
    console.log("details: ", error.error_DETAILS);
  }

  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));

  const err = await db.write(async () => {
    return await Errors_DB.create((waterMelon_ERR: Error_MODEL) => {
      waterMelon_ERR.message = `${GET_readableDateNow()}: ${
        error?.internal_MSG
          ? error.internal_MSG
          : "The erorr didn't have an internal_MSG"
      }`;
      waterMelon_ERR.function = error?.function_NAME
        ? error.function_NAME
        : "The error didn't have a function_NAME";
      waterMelon_ERR.details = error?.error_DETAILS
        ? JSON.stringify(error.error_DETAILS)
        : "No details provided";
    });
  });

  if (err) console.log("🟢 Error created 🟢");
  else console.error("🔴 Error creation failed 🔴 ");
  console.log("------------------------------------------------");
}
