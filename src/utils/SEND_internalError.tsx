//
//
//

import db, { Errors_DB } from "../db";
import { Error_MODEL } from "../db/watermelon_MODELS";

export default async function SEND_internalError(data: {
  user_id: string | undefined;
  message: string;
  function_NAME: string;
  details?: Object;
}) {
  const { user_id, message, function_NAME, details } = data;
  console.log("------------------------------------------------");
  console.log(data.message);
  console.log(data.function_NAME);
  console.log(data.details);
  console.log("------------------------------------------------");
  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));

  if (!user_id) return;

  await db.write(async () => {
    await Errors_DB.create((error: Error_MODEL) => {
      error.user_id = user_id;
      error.message = message;
      error.function = function_NAME;
      error.details = JSON.stringify(details);
    });
  });
}
