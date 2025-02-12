//
//
//

import db, { Errors_DB } from "../../db";
import Error_MODEL from "../../db/models/Error_MODEL";
import { Error_PROPS, General_ERROR } from "../../types/error_TYPES";

const GET_readableDateNow = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" });

export async function SEND_internalError(error: General_ERROR) {
  console.log("------------------------------------------------");
  console.error(`🔴 ${error.function_NAME} => ${error.message}`);

  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));

  // const err = await db.write(async () => {
  //   return await Errors_DB.create((waterMelon_ERR: Error_MODEL) => {
  //     waterMelon_ERR.message = `${GET_readableDateNow()}: ${
  //       error?.message ? error.message : "The erorr didn't have an message"
  //     }`;
  //     waterMelon_ERR.function = error?.function_NAME
  //       ? error.function_NAME
  //       : "The error didn't have a function_NAME";
  //     waterMelon_ERR.details = error?.error_DETAILS
  //       ? JSON.stringify(error.error_DETAILS)
  //       : "No details provided";
  //   });
  // });

  // if (err) console.log("🟢 Error created 🟢");
  // else console.error("🔴 Error creation failed 🔴 ");
  // console.log("------------------------------------------------");
  // send to supabase
}
