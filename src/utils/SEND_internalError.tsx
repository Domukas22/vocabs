//
//
//

export default function SEND_internalError(data: {
  message: string;
  place: string;
}) {
  console.log(data);
  console.error(data.message);
  // Integrate Sentry here for logging
  // Sentry.captureException(new Error(internalError_MSG));
}
