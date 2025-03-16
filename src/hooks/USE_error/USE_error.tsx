//
//
//

import { useCallback, useState } from "react";

export function USE_error<error_TYPES>() {
  const [error, SET_error] = useState<error_TYPES | undefined>();

  const RESET_error = useCallback(() => SET_error(undefined), [SET_error]);

  return { error, SET_error, RESET_error };
}
