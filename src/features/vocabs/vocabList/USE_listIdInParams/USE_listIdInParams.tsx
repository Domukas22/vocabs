//
//
//

import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";

export function USE_listIdInParams() {
  const { list_id = "someIdToAvoidError" } = useLocalSearchParams();
  const listIdString = useMemo(
    () =>
      Array.isArray(list_id) ? list_id[0] : list_id || "someIdToAvoidError",
    [list_id]
  );
  return { urlParamsList_ID: listIdString };
}
