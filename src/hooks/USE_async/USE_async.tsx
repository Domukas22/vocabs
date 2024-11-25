//
//
//
import { useState, useCallback, useEffect } from "react";
import { Error_PROPS } from "../../props";

import HANDLE_internalError from "../../utils/SEND_internalError";
import HANDLE_keyboardDismiss from "../../utils/HANDLE_keyboardDismiss/HANDLE_keyboardDismiss";
import HANDLE_userError from "../../utils/HANDLE_userError/HANDLE_userError";

export default function USE_async<
  args_TYPE,
  responseData_TYPE,
  responseError_TYPE extends Error_PROPS
>({
  args,
  fn_NAME,
  dependencies = [],
  defaultErr_MSG,
  SHOULD_fetchOnLoad = false,
  SHOULD_returnNothing = false,
  fn,
  onSuccess = () => {},
  handleInternalError = HANDLE_internalError, // Allow override
  handleKeyboardDismiss = HANDLE_keyboardDismiss, // Allow override
}: {
  args?: args_TYPE;
  fn_NAME: string;
  dependencies?: any[];
  defaultErr_MSG: string;
  SHOULD_fetchOnLoad?: boolean;
  SHOULD_returnNothing?: boolean;
  fn: (
    args: args_TYPE
  ) => Promise<{ data: responseData_TYPE; error?: responseError_TYPE }>;
  onSuccess?: (data: responseData_TYPE) => void;
  handleInternalError?: typeof HANDLE_internalError; // For testing
  handleKeyboardDismiss?: typeof HANDLE_keyboardDismiss; // For testing
}) {
  const [loading, SET_loading] = useState(false);
  const [error, SET_error] = useState<responseError_TYPE>();
  const [data, SET_data] = useState<responseData_TYPE>();

  const RESET_errors = useCallback(() => SET_error(undefined), []);

  const execute = useCallback(
    async (args: args_TYPE) => {
      if (SHOULD_returnNothing) {
        if (loading) SET_loading(false);
        if (data) SET_data(undefined);
        if (error) SET_error(undefined);
        return;
      }

      SET_loading(true);
      SET_error(undefined);
      SET_data(undefined);

      console.log("FIRE");
      console.log(args);

      try {
        const { data, error } = await fn(args);
        if (error) {
          SET_error(error);
        } else {
          console.log("executed data --> ", data);
          SET_data(data);
          onSuccess(data);
        }
      } catch (err: any) {
        const _err = HANDLE_userError({
          error: err,
          internalErrorUser_MSG: defaultErr_MSG,
          function_NAME: `USE_async --> ${fn_NAME}`,
        });

        SET_error(_err as responseError_TYPE);
      } finally {
        SET_loading(false);
      }
    },
    [fn, ...dependencies]
  );

  useEffect(() => {
    if (SHOULD_fetchOnLoad) {
      if (args) {
        execute(args);
      }
    }
  }, [SHOULD_fetchOnLoad, execute, ...dependencies]);

  useEffect(() => {
    if (!error) return;

    handleKeyboardDismiss?.(error.error_TYPE);
    handleInternalError?.({ error, function_NAME: fn_NAME });
  }, [error, fn_NAME, handleInternalError, handleKeyboardDismiss]);

  return { data, loading, error, execute, RESET_errors };
}
