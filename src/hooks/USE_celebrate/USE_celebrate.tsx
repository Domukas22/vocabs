//
//
//

import { VIBRATE } from "@/src/utils";
import { useCallback } from "react";
import { USE_toast } from "../USE_toast/USE_toast";

export function USE_celebrate() {
  const { TOAST } = USE_toast();

  const celebrate = useCallback(
    (successNotification_TEXT: string = "Success") => {
      TOAST("success", successNotification_TEXT);
      VIBRATE("soft");
    },
    [TOAST, VIBRATE]
  );

  return { celebrate };
}
