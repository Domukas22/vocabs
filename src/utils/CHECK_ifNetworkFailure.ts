//
//
//

export default function CHECK_ifNetworkFailure(err: any) {
  return err?.message?.includes("Network request failed");
}
