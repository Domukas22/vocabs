//
//
//
import { useState, useCallback } from "react";

export default function USE_error() {
  const [HAS_error, SET_hasError] = useState(false);
  const [error_MSG, SET_errorMsg] = useState<string>();
  const [error_TYPE, SET_errorType] = useState<string>();

  const CREATE_error = useCallback(({ error_MSG, error_TYPE }: Error_PROPS) => {
    SET_hasError(true);
    SET_errorMsg(error_MSG);
    SET_errorType(error_TYPE);
  }, []);

  const RESET_error = useCallback(() => {
    SET_hasError(false);
    SET_errorMsg("");
    SET_errorType("");
  }, []);

  return {
    HAS_error,
    error_MSG,
    error_TYPE,
    CREATE_error,
    RESET_error,
  };
}
