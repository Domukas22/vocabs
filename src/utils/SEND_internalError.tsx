//
//
//

import db, { Errors_DB } from "../db";
import { Error_MODEL } from "../db/watermelon_MODELS";

const GET_readableDateNow = () =>
  new Date().toLocaleDateString("en-US", { day: "numeric", month: "long" });

export default async function SEND_internalError(data: {
  message: string;
  function_NAME: string;
  details?: Object;
}) {
  const { message, function_NAME, details } = data;
  console.log("------------------------------------------------");
  console.error("🔴 " + data.message + " 🔴");
  console.log("fucntion: ", data.function_NAME);
  if (data.details) {
    console.log("defailts: ", data.details);
  }

  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));

  const err = await db.write(async () => {
    return await Errors_DB.create((error: Error_MODEL) => {
      error.message = `${GET_readableDateNow()}: ${message}`;
      error.function = function_NAME;
      error.details = JSON.stringify(details);
    });
  });

  if (err) console.log("🟢 Error created 🟢");
  else console.log("🔴  Error creation failed 🔴 ");
  console.log("------------------------------------------------");
}
