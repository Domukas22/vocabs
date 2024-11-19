//
//
//
import { useCallback, useEffect, useState } from "react";

export default function USE_async<T>({
  callback,
  error_PROPS,
  dependencies = [],
}: {
  callback: () => Promise<T>;
  error_PROPS: any;
  dependencies?: any[];
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<error_PROPS | undefined>();
  const [value, setValue] = useState<T | undefined>();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(undefined);
    setValue(undefined);
    callback()
      .then(setValue)
      .catch((error: any) => {})
      .finally(() => setLoading(false));
  }, dependencies);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value, callback: callbackMemoized };
}
