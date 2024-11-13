//
//
//
import { useState, useCallback } from "react";

interface CreateError_PROPS {
  userError_MSG: string;
  internalError_MSG?: string;
}

export default function USE_error() {
  const [HAS_error, SET_hasError] = useState(false);
  const [userError_MSG, SET_userMsg] = useState("");

  const CREATE_error = useCallback(
    ({ userError_MSG, internalError_MSG }: CreateError_PROPS) => {
      SET_hasError(true);
      SET_userMsg(userError_MSG);

      if (internalError_MSG) {
        console.error(internalError_MSG);
        // Integrate Sentry here for logging
        // Sentry.captureException(new Error(internalError_MSG));
      }
    },
    []
  );

  const RESET_error = useCallback(() => {
    SET_hasError(false);
    SET_userMsg("");
  }, []);

  // HAS_error and userError_MSG are not needed for the forms, but are needed for anything tha ts not a form
  return { HAS_error, userError_MSG, CREATE_error, RESET_error };
}
