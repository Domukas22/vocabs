//
//
//
import { useState, useCallback } from "react";

interface CreateError_PROPS {
  userError_MSG: string;
  reason: string;
  internalError_MSG?: string | null;
}

export default function USE_error() {
  const [HAS_error, SET_hasError] = useState(false);
  const [userError_MSG, SET_userMsg] = useState<string>();
  const [error_REASON, SET_errorReason] = useState<string>();
  const [HAS_internalError, SET_hasInternalError] = useState(false);

  const CREATE_error = useCallback(
    ({ userError_MSG, internalError_MSG, reason }: CreateError_PROPS) => {
      SET_hasError(true);
      SET_userMsg(userError_MSG);
      SET_errorReason(reason);

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

  return {
    HAS_error,
    userError_MSG,
    error_REASON,
    HAS_internalError,
    CREATE_error,
    RESET_error,
  };
}
