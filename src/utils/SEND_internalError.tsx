//
//
//

import db, { Errors_DB } from "../db";
import Error_MODEL from "../db/models/Error_MODEL";
import { Error_PROPS } from "../props";

const GET_readableDateNow = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" });

export default async function HANDLE_internalError({
  error,
  function_NAME,
}: {
  error: Error_PROPS;
  function_NAME: string;
}) {
  if (error.error_TYPE !== "internal" && error.error_TYPE !== "unknown") return;

  console.log("------------------------------------------------");
  console.error("🔴 " + error.internal_MSG + " 🔴");
  console.log("fucntion: ", error.function_NAME);
  if (error.error_DETAILS) {
    console.log("defailts: ", error.error_DETAILS);
  }

  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));

  const err = await db.write(async () => {
    return await Errors_DB.create((waterMelon_ERR: Error_MODEL) => {
      waterMelon_ERR.message = `${GET_readableDateNow()}: ${
        error.internal_MSG
      }`;
      waterMelon_ERR.function = error.function_NAME;
      waterMelon_ERR.details = JSON.stringify(error.error_DETAILS);
    });
  });

  if (err) console.log("🟢 Error created 🟢");
  else console.log("🔴  Error creation failed 🔴 ");
  console.log("------------------------------------------------");
}
