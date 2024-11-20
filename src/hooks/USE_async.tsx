//
//
//
import { useCallback, useState } from "react";

export default function USE_async<args_TYPE, response_TYPE>({
  callback,
  dependencies = [],
  onSuccess = () => {},
  onError = () => {},
}: {
  callback: (args: args_TYPE) => Promise<response_TYPE>;
  dependencies?: any[];
  onSuccess?: (response?: response_TYPE) => void;
  onError?: (response?: response_TYPE) => void;
}) {
  const [response, setResponse] = useState<response_TYPE>();
  const [error, SET_error] = useState<response_TYPE>();
  const [response, setResponse] = useState<response_TYPE>();
  const [loading, setLoading] = useState(false);

  const RESET_errors = useCallback(() => setResponse(undefined), []);

  const execute = useCallback(
    async (args: args_TYPE) => {
      setLoading(true);
      setResponse(undefined);

      const {} = await callback(args);

      try {
        const result = await callback(args);
        setResponse(result);
        onSuccess(result);
      } catch (error: any) {
        setResponse(error);

        onError(error);
      } finally {
        setLoading(false);
      }
    },
    [callback, ...dependencies]
  );

  return { loading, response, execute, RESET_errors };
}
