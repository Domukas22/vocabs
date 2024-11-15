//
//
//

import db, { Users_DB } from "@/src/db";
import { User_MODEL } from "@/src/db/watermelon_MODELS";
import SEND_internalError from "@/src/utils/SEND_internalError";

const defaultError_MSG =
  "Something went wrong when trying to load your profile. Please reload the app and try again. This problem has been recorded and will be reviewed by developers as soon as possible. If the problem persists, please contact support. We apologize for the inconvenience.";

interface Response {
  success: boolean;
  msg?: string;
  watermelon_USER?: User_MODEL;
  error_REASON?: "internal";
}

// Create a new user in WatermelonDB
export async function CREATE_watermelonUser(
  supabase_USER: User_MODEL
): Promise<Response> {
  if (!supabase_USER) {
    SEND_internalError({
      message: `🔴 supabase_USER undefined when trying ot create WatermelonDB user 🔴`,
      place: "CREATE_watermelonUser",
    });
    return { msg: defaultError_MSG, success: false, error_REASON: "internal" };
  }

  let watermelon_USER;
  await db.write(async () => {
    watermelon_USER = await Users_DB.create((user) => {
      user._raw.id = supabase_USER.id;
      user.username = supabase_USER.username;
      user.email = supabase_USER.email;
      user.max_vocabs = supabase_USER.max_vocabs;
      user.list_submit_attempt_count = supabase_USER.list_submit_attempt_count;
      user.preferred_lang_id = supabase_USER.preferred_lang_id;
    });
  });

  if (!watermelon_USER) {
    SEND_internalError({
      message: `🔴  Something went wrong when creating Watermelon user 🔴`,
      place: "CREATE_watermelonUser",
    });
    return { msg: defaultError_MSG, success: false, error_REASON: "internal" };
  }

  return { success: true, watermelon_USER };
}
