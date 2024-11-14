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
  const [HAS_internalError, SET_hasInternalError] = useState(false);

  const CREATE_error = useCallback(
    ({ userError_MSG, internalError_MSG }: CreateError_PROPS) => {
      SET_hasError(true);
      SET_userMsg(userError_MSG);

      if (internalError_MSG) {
        SET_hasInternalError(true);
        console.error(internalError_MSG);
        // Integrate Sentry here for logging
        // Sentry.captureException(new Error(internalError_MSG));
      }
    },
    []
  );

  const RESET_error = useCallback(() => {
    SET_hasInternalError(false);
    SET_hasError(false);
    SET_userMsg("");
  }, []);

  const HANDLE_validationErrors = (message: string, internalMsg?: string) => {
    CREATE_error({ userError_MSG: message, internalError_MSG: internalMsg });
    return { success: false, userError_MSG: message };
  };

  return {
    HAS_error,
    HAS_internalError,
    userError_MSG,
    CREATE_error,
    RESET_error,
    HANDLE_validationErrors,
  };
}
