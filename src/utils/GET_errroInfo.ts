//
//
//

import GET_errorMessage from "./GET_errorMessage";
import GET_errorType from "./GET_errorType";

export default function GET_errroInfo({
  error,
  process,
}: {
  error: any;
  process: string;
}) {
  const error_TYPE = GET_errorType(error);
  const userError_MESSAGE = GET_errorMessage({ error, error_TYPE, process });

  return { error_TYPE, userError_MESSAGE };
}
