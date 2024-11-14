//
//
//

export default function CONVERT_EpochToTimestampWithTimeZone(
  epochTime: number
): string {
  return new Date(epochTime).toISOString();
}
